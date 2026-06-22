variable "project_id" {
  description = "The ID of the Google Cloud project"
  type        = string
  default     = "communityai-production"
}

variable "region" {
  description = "The default region for resources"
  type        = string
  default     = "us-central1"
}

variable "db_password" {
  description = "Password for the Cloud SQL / AlloyDB instance"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "API Key for Gemini Model Access via Vertex AI"
  type        = string
  sensitive   = true
}
