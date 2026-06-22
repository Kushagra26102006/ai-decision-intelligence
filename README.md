# 🌍 CommunityAI: The Community Intelligence Operating System

<p align="center">
  <em>Transforming communities from reactive decision-making to proactive, AI-driven intelligence.</em>
</p>

## 🚀 Overview

**CommunityAI** is an enterprise-grade AI platform designed to help municipalities, healthcare providers, NGOs, and governments make smarter, faster, and more data-driven decisions. 

Instead of just answering *"What happened?"*, CommunityAI leverages **Google Cloud, Gemini 2.5, and a Multi-Agent Architecture** to predict *"What will happen next?"* and autonomously execute workflows to solve emerging problems.

## ✨ Key Innovation Features

- **🧠 Multi-Agent Architecture:** Powered by Google's Agent Development Kit (ADK), specialized agents (Mobility, Healthcare, Environment) collaborate to reason through complex community issues.
- **📚 RAG Knowledge Engine:** Integrates with Vertex AI Vector Search to ground all AI responses in verified community policies, reports, and documentation, ensuring zero hallucinations.
- **🔮 Predictive Intelligence:** A robust Risk Radar that analyzes historical event streams to forecast anomalies (e.g., impending traffic congestion, flood risks) and output prescriptive recommendations.
- **⚙️ Autonomous Workflow Engine:** Listens to incoming data events via Pub/Sub. When high-priority issues are detected, it automatically executes Standard Operating Procedures, enforcing **Human-in-the-Loop** checkpoints for critical budget/resource deployments.

## 🏗️ Enterprise Architecture

CommunityAI is a highly scalable, event-driven, Cloud-Native platform.

- **Frontend:** Next.js, Tailwind CSS, Shadcn UI, Recharts (Deployed on Cloud Run).
- **Backend API:** Node.js, Express.js (Deployed on Cloud Run).
- **Database:** Prisma ORM, PostgreSQL (AlloyDB / Cloud SQL).
- **Event Streaming:** Google Cloud Pub/Sub & Cloud Functions.
- **AI/ML:** Google Gemini 2.5 Pro/Flash, Vertex AI Embeddings.
- **Infrastructure:** Terraform IaC, Docker, GitHub Actions CI/CD.

## 💻 Running Locally

To spin up the MVP locally for evaluation:

1. **Clone the repository & install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment Variables:**
   Create a \`.env\` file in the \`backend\` directory:
   \`\`\`env
   DATABASE_URL="postgresql://user:pass@localhost:5432/communityai"
   JWT_SECRET="your_secure_secret"
   GEMINI_API_KEY="your_google_ai_studio_key"
   \`\`\`

3. **Initialize the Database:**
   \`\`\`bash
   cd backend
   npx prisma generate
   npx prisma db push
   \`\`\`

4. **Start the Platform:**
   Start both the frontend and backend servers simultaneously from the root directory:
   \`\`\`bash
   npm run dev:all
   \`\`\`

5. **Access the Portals:**
   - **Admin Dashboard:** \`http://localhost:3000/dashboard\`
   - **Citizen Connect:** \`http://localhost:3000/citizen\`

## 📖 Documentation & Strategy

For hackathon judges and investors, please review our comprehensive strategy assets located in the \`docs/\` folder:
- [\`docs/PITCH_DECK.md\`](./docs/PITCH_DECK.md) - The 10-Slide Pitch Deck, Business Model, and 5-Minute Demo Flow.
- [\`docs/gcp-architecture.md\`](./docs/gcp-architecture.md) - Deep dive into our Google Cloud serverless production deployment strategy.

---
*Built with ❤️ for a sustainable, resilient future.*
