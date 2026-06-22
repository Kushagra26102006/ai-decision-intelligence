terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# -----------------------------------------------------------------------------
# 1. ARTIFACT REGISTRY (DOCKER IMAGES)
# -----------------------------------------------------------------------------
resource "google_artifact_registry_repository" "app_repo" {
  location      = var.region
  repository_id = "communityai-repo"
  description   = "Docker repository for CommunityAI Cloud Run images"
  format        = "DOCKER"
}

# -----------------------------------------------------------------------------
# 2. CLOUD SQL (ALLOYDB / POSTGRESQL)
# -----------------------------------------------------------------------------
resource "google_sql_database_instance" "postgres_instance" {
  name             = "communityai-db-instance"
  database_version = "POSTGRES_14"
  region           = var.region

  settings {
    tier = "db-custom-2-7680" # 2 vCPU, 7.5 GB RAM (Adjust for scale)
    backup_configuration {
      enabled = true
      start_time = "02:00"
    }
    ip_configuration {
      ipv4_enabled    = true
      require_ssl     = true
    }
  }
}

resource "google_sql_database" "database" {
  name     = "communityai"
  instance = google_sql_database_instance.postgres_instance.name
}

resource "google_sql_user" "users" {
  name     = "communityai_user"
  instance = google_sql_database_instance.postgres_instance.name
  password = var.db_password
}

# -----------------------------------------------------------------------------
# 3. PUB/SUB EVENT STREAMING
# -----------------------------------------------------------------------------
resource "google_pubsub_topic" "data_events" {
  name = "community-data-events"
}

resource "google_pubsub_subscription" "ai_enrichment_sub" {
  name  = "ai-enrichment-subscription"
  topic = google_pubsub_topic.data_events.name

  ack_deadline_seconds = 60
}

# -----------------------------------------------------------------------------
# 4. CLOUD RUN (BACKEND API)
# -----------------------------------------------------------------------------
resource "google_cloud_run_service" "backend" {
  name     = "communityai-backend"
  location = var.region

  template {
    spec {
      containers {
        image = "\${var.region}-docker.pkg.dev/\${var.project_id}/\${google_artifact_registry_repository.app_repo.name}/backend:latest"
        
        env {
          name  = "DATABASE_URL"
          value = "postgresql://communityai_user:\${var.db_password}@\${google_sql_database_instance.postgres_instance.public_ip_address}:5432/communityai"
        }
        env {
          name  = "GEMINI_API_KEY"
          value = var.gemini_api_key
        }
        env {
          name  = "NODE_ENV"
          value = "production"
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# -----------------------------------------------------------------------------
# 5. CLOUD RUN (FRONTEND NEXT.JS)
# -----------------------------------------------------------------------------
resource "google_cloud_run_service" "frontend" {
  name     = "communityai-frontend"
  location = var.region

  template {
    spec {
      containers {
        image = "\${var.region}-docker.pkg.dev/\${var.project_id}/\${google_artifact_registry_repository.app_repo.name}/frontend:latest"
        
        env {
          name  = "NEXT_PUBLIC_API_URL"
          value = google_cloud_run_service.backend.status[0].url
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Allow unauthenticated invocation for frontend (Public facing)
resource "google_cloud_run_service_iam_member" "public_access_frontend" {
  service  = google_cloud_run_service.frontend.name
  location = google_cloud_run_service.frontend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
