# Pravaha AI — Documentation Hub
### *MOVEMENT • SUPPORT • SAFETY*

Welcome to the comprehensive technical documentation and product specifications for **Pravaha AI**, an AI-powered on-road vehicle breakdown assistance and intelligent service dispatch ecosystem.

---

## 📚 Documentation Index

| Document | Description |
|---|---|
| 📄 **[PRD.md](file:///d:/Projects/Major-proj-1/docs/PRD.md)** | **Product Requirements Document**: Problem statement, target personas, functional & non-functional requirements, and core success metrics. |
| 🏗️ **[ARCHITECTURE_AND_WORKFLOW.md](file:///d:/Projects/Major-proj-1/docs/ARCHITECTURE_AND_WORKFLOW.md)** | **System Architecture & Workflows**: Microservice topology, Mermaid sequence diagrams, dispatch state machines, and triage data flows. |
| 💻 **[IMPLEMENTATION_GUIDE.md](file:///d:/Projects/Major-proj-1/docs/IMPLEMENTATION_GUIDE.md)** | **Technical Implementation & Tech Stack**: Detailed directory breakdown, file-by-file explanations, API contracts, database schemas, and configuration setup. |

---

## 🌟 Quick Project Overview

```
                      +---------------------------------------+
                      |       Stranded Drivers & Mechanics    |
                      +---------------------------------------+
                                     /         \
                                    /           \
               +-----------------------+     +-----------------------+
               |  React 19 Web Portal  |     |   React Native Expo   |
               |     (Port 5173)       |     |   Mobile App (v2.0)   |
               +-----------------------+     +-----------------------+
                                    \           /
                                     \         /
                                      v       v
                      +---------------------------------------+
                      |      Spring Boot 4 / Java 21 Engine   |
                      |        Security • JWT • Geodesic      |
                      |               (Port 8080)             |
                      +---------------------------------------+
                                     /         \
                      (JSON RPC)    /           \   (Cloud Sync)
                                   v             v
       +-------------------------------+     +-----------------------------------+
       |     FastAPI AI Microservice   |     |       MongoDB Atlas Cloud         |
       |  Heuristics • ETA • Ranking   |     |    3-Node Replica Set (Mumbai)    |
       |          (Port 8000)          |     |          (Cluster0 GCP)           |
       +-------------------------------+     +-----------------------------------+
```

### Key Highlights
- **Tri-Tier Microservice Topology**: Decoupled Web/Mobile presentation, Spring Boot orchestration, and Python FastAPI artificial intelligence.
- **Geodesic Haversine Proximity Matcher**: Automated geographic radius search (15km default) identifying available, verified mechanics.
- **Neural Heuristic Diagnostic Engine**: Classifies unstructured driver symptoms to predict fault severity, recommended tooling, and ETA windows.
- **Enterprise Security**: Stateless BCrypt password encryption paired with HMAC-SHA512 JWT bearer token authorization.
- **Cloud Persistence**: Production-ready MongoDB Atlas deployment with automated seeding and replica set failover.
