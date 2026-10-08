# Technical Implementation Guide — Pravaha AI
### *MOVEMENT • SUPPORT • SAFETY*

This guide provides an in-depth breakdown of the codebase, module structures, API specifications, database schemas, and configuration setup for **Pravaha AI**.

---

## 1. 📂 Codebase Directory Structure

```text
Major-proj-1/
├── docs/                                  # Comprehensive System Documentation
│   ├── README.md                          # Documentation Hub & Navigation
│   ├── PRD.md                             # Product Requirements Document
│   ├── ARCHITECTURE_AND_WORKFLOW.md       # Architecture & Sequence Workflows
│   └── IMPLEMENTATION_GUIDE.md            # Technical Implementation & Schemas
│
├── images_video/                          # Raw 2K Visual Media & Video Assets
│   ├── Holographic_map_connecting_to_te._20261008171312.mp4
│   ├── AI_diagnoses_vehicle_issue_2K_20261008162244.jpg
│   ├── AI_matches_user_with_technician_2K_20261008162102.jpg
│   ├── Car_accelerates_down_futuristic_._2K_20261008162128.jpg
│   ├── Man_standing_by_broken_SUV_2K_20261008162333.jpg
│   └── Technician_arrives_with_tablet_2K_20261008162221.jpg
│
├── smartroad-frontend/                    # Web Application (React 19 + Vite)
│   ├── public/
│   │   ├── media/                         # High-res video & 2K imagery for web
│   │   │   ├── hero-radar.mp4             # Holographic GPS radar video
│   │   │   ├── ai-diagnostics.jpg         # AI failure classifier visual
│   │   │   ├── ai-matching.jpg            # Haversine proximity match visual
│   │   │   ├── futuristic-road.jpg        # Highway ecosystem visual
│   │   │   ├── stranded-driver.jpg        # Stranded driver SOS visual
│   │   │   └── technician-arrived.jpg     # Verified mechanic visual
│   │   └── logo.png                       # Official Pravaha AI Emblem
│   ├── src/
│   │   ├── assets/                        # 3D isometric breakdown illustrations
│   │   ├── components/                    # Navbar, Footer, AssistanceMap, ProtectedRoute
│   │   ├── context/                       # AuthContext (JWT session management)
│   │   ├── pages/                         # Home, About, Contact, Login, Register, DriverDashboard, ProviderDashboard, AdminDashboard
│   │   ├── services/                      # Axios API clients & interceptors
│   │   ├── App.jsx                        # React Router 7 route definitions
│   │   ├── index.css                      # Modern dark-mode glassmorphic CSS tokens
│   │   └── main.jsx                       # Entry bootstrap
│   └── package.json                       # Version 2.0.0
│
├── smartroad-mobile/                      # Cross-Platform Mobile App (Expo SDK 57)
│   ├── assets/
│   │   ├── media/                         # Mobile mirror of 2K visuals & video
│   │   └── icon.png                       # App icons & splash
│   ├── src/
│   │   ├── components/                    # ActiveJobBanner, AssistanceMap, DiagnosisCard, GlassCard, RatingModal
│   │   ├── config/                        # api.js (Axios client with dynamic IP resolver)
│   │   ├── context/                       # AuthContext (AsyncStorage token storage)
│   │   ├── screens/                       # AuthScreen, DriverHomeScreen, ProviderHomeScreen, GarageScreen, SettingsScreen
│   │   └── theme/                         # Mobile color palette & glass tokens
│   ├── App.js                             # Tab navigation & emulator wrapper
│   ├── app.json                           # Expo 57 configuration (v2.0.0)
│   └── package.json                       # Version 2.0.0
│
├── smartroad-backend/                     # Core Business Backend (Spring Boot 4 / Java 21)
│   ├── src/main/java/com/smartroad/
│   │   ├── config/
│   │   │   ├── DataInitializer.java       # Automatic DB seeder (Admin, Driver, Provider)
│   │   │   └── WebClientConfig.java       # Reactive WebClient connector to FastAPI AI
│   │   ├── controller/
│   │   │   ├── AuthController.java        # Login, registration, token issuing
│   │   │   ├── DriverController.java      # Breakdown creation, history, vehicle ops
│   │   │   ├── ProviderController.java    # Duty toggle, incoming requests, status transitions
│   │   │   └── HealthController.java      # Telemetry health checks (DB & AI status)
│   │   ├── dto/                           # Request & Response payload models
│   │   ├── exception/                     # Global exception handling & custom errors
│   │   ├── model/                         # MongoDB documents (User, BreakdownRequest, etc.)
│   │   ├── repository/                    # Spring Data Mongo repository interfaces
│   │   ├── security/                      # JwtTokenProvider, JwtAuthenticationFilter, SecurityConfig
│   │   └── service/                       # AuthService, DispatchService (Haversine logic)
│   ├── src/main/resources/
│   │   └── application.yml                # Configuration & MongoDB Atlas URI
│   ├── pom.xml                            # Maven dependencies (Java 21, Spring Boot 4.1.1)
│   └── mvnw.cmd                           # Windows Maven Wrapper
│
└── smartroad-ai/                          # AI & Machine Learning Microservice (FastAPI)
    ├── app/
    │   ├── main.py                        # FastAPI application entry & CORS
    │   ├── schemas.py                     # Pydantic v2 validation models
    │   └── services.py                    # AIService heuristic engine, ETA, and ranker
    ├── requirements.txt                   # FastAPI, Uvicorn, Pydantic, NumPy
    └── run.py                             # Development server runner (Port 8000)
```

---

## 2. 💻 Tech Stack & Justifications

### A. Frontend Presentation Layer
- **React 19 & Vite 8**: Ultra-fast hot module replacement (HMR), minimal bundle size, and concurrent rendering support.
- **Leaflet & React-Leaflet**: Lightweight, hardware-accelerated OpenStreetMap rendering without expensive proprietary Google Maps API billing.
- **Modern Vanilla CSS & Glassmorphism**: Tailored HSL CSS variables, dark-mode styling, subtle backdrop-filter blurs, and responsive grid layouts without Tailwind overhead.
- **Lucide Icons**: Consistent, clean iconography across driver and provider dashboards.

### B. Mobile Companion Layer
- **React Native (Expo SDK 57)**: Native performance on Android & iOS while supporting zero-setup PC browser emulation via `expo start --web`.
- **Expo Location**: Native GPS telemetry fetching exact device coordinates with simulated fallback for test corridors.
- **Async Storage**: Persistent token and server endpoint caching on mobile devices.

### C. Core Orchestration Engine
- **Java 21 & Spring Boot 4.1.1**: Enterprise-grade concurrency, strict type safety, modular microservice architecture, and virtual thread readiness.
- **Spring Security 6 & JJWT**: Stateless bearer token verification, BCrypt password hashing, and role-based endpoint authorization (`ROLE_DRIVER`, `ROLE_SERVICE_PROVIDER`, `ROLE_ADMIN`).
- **Spring Data MongoDB**: Object-document mapping (ODM) with reactive aggregation pipelines and proximity queries.
- **Spring WebFlux (WebClient)**: Non-blocking, reactive HTTP calls to the Python FastAPI microservice with automated retries and fallback timeouts.

### D. Artificial Intelligence Microservice
- **Python 3.11+ & FastAPI**: High-throughput asynchronous REST API for rapid mathematical evaluation and heuristic reasoning.
- **Pydantic v2**: Strict request/response payload validation and automatic OpenAPI (Swagger) generation at `/docs`.
- **Heuristic Classifier & ETA Engine**: Analyzes natural language symptoms, calculates spatial Haversine distances, and generates dynamic ETA windows based on urban highway traffic models.

### E. Cloud Persistence
- **MongoDB Atlas 8.0**:
  - **Cluster**: `Cluster0` deployed in Google Cloud Platform (GCP) Mumbai (`asia-south1`).
  - **Architecture**: 3-node replica set (`primary`, `secondary`, `secondary`) guaranteeing continuous availability and automatic failover.
  - **Connection Protocol**: SRV lookup via `mongodb+srv://...` with TLS/SSL encryption in transit.

---

## 3. 🔌 API Contract Reference

### Authentication APIs (`/api/auth`)
| Endpoint | Method | Role | Request Body | Description |
|---|---|---|---|---|
| `/api/auth/register/driver` | `POST` | Public | `DriverRegisterRequest` (email, password, name, phone, vehicle) | Creates driver account and initial vehicle. |
| `/api/auth/register/provider` | `POST` | Public | `ProviderRegisterRequest` (email, password, businessName, fee) | Creates service provider account and profile. |
| `/api/auth/login` | `POST` | Public | `LoginRequest` (email, password) | Validates credentials; returns JWT token + user profile. |

### Driver Operations APIs (`/api/driver`)
| Endpoint | Method | Role | Headers | Description |
|---|---|---|---|---|
| `/api/driver/request-assistance` | `POST` | `DRIVER` | `Authorization: Bearer <JWT>` | Dispatches new breakdown ticket with GPS coords. |
| `/api/driver/active-request` | `GET` | `DRIVER` | `Authorization: Bearer <JWT>` | Retrieves currently ongoing assistance ticket. |
| `/api/driver/history` | `GET` | `DRIVER` | `Authorization: Bearer <JWT>` | Fetches history of past breakdown requests. |
| `/api/driver/cancel/{id}` | `POST` | `DRIVER` | `Authorization: Bearer <JWT>` | Aborts request before technician arrival. |
| `/api/driver/rate` | `POST` | `DRIVER` | `Authorization: Bearer <JWT>` | Submits 1–5 star rating and text review. |
| `/api/driver/diagnose` | `POST` | `DRIVER` | `Authorization: Bearer <JWT>` | Queries FastAPI AI microservice for symptom triage. |
| `/api/driver/vehicles` | `POST` | `DRIVER` | `Authorization: Bearer <JWT>` | Registers additional vehicle to driver garage. |

### Service Provider APIs (`/api/provider`)
| Endpoint | Method | Role | Headers | Description |
|---|---|---|---|---|
| `/api/provider/incoming` | `GET` | `PROVIDER` | `Authorization: Bearer <JWT>` | Returns all pending requests within radius. |
| `/api/provider/active-job` | `GET` | `PROVIDER` | `Authorization: Bearer <JWT>` | Returns currently accepted job. |
| `/api/provider/requests/{id}/status`| `POST` | `PROVIDER` | `Authorization: Bearer <JWT>` | Transitions state (`ACCEPTED`, `EN_ROUTE`, `ON_SCENE`, `COMPLETED`). |
| `/api/provider/availability` | `PUT` | `PROVIDER` | `Authorization: Bearer <JWT>` | Toggles On-Duty / Off-Duty radar status. |

### Health & Monitoring (`/api/health`)
| Endpoint | Method | Auth | Response | Description |
|---|---|---|---|---|
| `/api/health` | `GET` | Public | `{ status: "UP", mongodb: { status: "UP" }, ai_microservice: { status: "UP" } }` | Live system telemetry pinging DB and AI engine. |

### FastAPI AI Microservice (`http://localhost:8000`)
| Endpoint | Method | Payload | Returns | Description |
|---|---|---|---|---|
| `/ai/breakdown/classify` | `POST` | `{ selected_problem, symptoms, has_image }` | `BreakdownClassifyResponse` | Analyzes symptoms and returns probable cause, severity, rig. |
| `/ai/eta/predict` | `POST` | `{ distance_km, traffic_condition }` | `ETAPredictResponse` | Generates dynamic arrival window. |
| `/ai/provider/recommend` | `POST` | `{ breakdown_type, providers }` | `ProviderRecommendationResponse` | Evaluates multi-factor suitability score. |

---

## 4. 🗄️ Database Schemas (MongoDB Atlas)

### Collection: `users`
```json
{
  "_id": "6ac77e34223f65d54e0252a2",
  "email": "2311it010159@mallareddyuniversity.ac.in",
  "password": "$2a$10$e8w.x.example.hashed.password",
  "fullName": "Aniket Ramde",
  "phone": "+91 6304886341",
  "role": "ADMIN",
  "active": true,
  "createdAt": "2026-10-08T11:27:48.246Z",
  "updatedAt": "2026-10-08T11:27:48.246Z"
}
```

### Collection: `service_provider_profiles`
```json
{
  "_id": "6ac77e34223f65d54e0252a5",
  "userId": "6ac77e34223f65d54e0252a4",
  "businessName": "Viva Towing Service",
  "contactPhone": "+91 80743 24758",
  "address": "Plot 458, near New WHSC, Kompally, Dundigal 500100",
  "latitude": 17.5517427,
  "longitude": 78.4823093,
  "available": true,
  "servicesOffered": ["TOWING"],
  "rating": 4.9,
  "totalRatings": 47,
  "totalJobsCompleted": 0,
  "baseFee": 1500.0,
  "open24x7": true,
  "distanceFromMRUKm": 4.2
}
```

### Real-World Service Provider Dataset (Malla Reddy University Cluster)
Origin Reference Point: **Malla Reddy University** (`17.562431`, `78.444306`)
- **17 Verified Real-World Providers** seeded directly into MongoDB Atlas.
- Spans key corridors: Bahadurpally, Maisammagudem, Gandi Maisamma, Kompally, Dundigal, Bachupally, Medchal, Suchitra, Kukatpally, Madhapur.
- Covers all 6 breakdown categories: Towing, Tyre, Battery, Diagnostics, Lockout, and Fuel Delivery.
- Dynamic telemetry reflects: Proximity distance from driver, distance from MRU campus, 24x7 emergency operation status, and service fee.

### Collection: `breakdown_requests`
```json
{
  "_id": "6ac77f99223f65d54e0252b0",
  "driverId": "6ac77e35223f65d54e0252a6",
  "driverName": "Suresh Reddy",
  "driverPhone": "+91 9876543210",
  "providerId": "6ac77e34223f65d54e0252a4",
  "providerBusinessName": "Apex Highway Auto Care & Towing",
  "providerPhone": "+91 9123456780",
  "breakdownType": "TYRE_ASSISTANCE",
  "description": "Rear tire completely flat after pothole",
  "driverLocation": {
    "latitude": 17.5472,
    "longitude": 78.2173,
    "address": "Near ORR Exit, Dundigal, Hyderabad"
  },
  "vehicle": {
    "make": "Hyundai",
    "model": "Creta SX",
    "licensePlate": "TS 09 EA 4521",
    "vehicleType": "4-Wheeler Sedan",
    "year": 2024,
    "color": "Phantom Black"
  },
  "status": "EN_ROUTE",
  "distanceKm": 4.2,
  "estimatedEtaMinutes": 14,
  "etaRange": "12-16 mins",
  "estimatedFee": 450.0,
  "rating": 5,
  "review": "Fast arrival and clean stepney swap!",
  "createdAt": "2026-10-08T11:45:00.000Z",
  "updatedAt": "2026-10-08T11:47:30.000Z"
}
```

---

## 5. 🔐 Pre-Seeded Default Accounts

For testing, review, and demonstration, the database initializer [DataInitializer.java](file:///d:/Projects/Major-proj-1/smartroad-backend/src/main/java/com/smartroad/config/DataInitializer.java) automatically provisions the following accounts into MongoDB Atlas:

| Role | Email | Password | Full Name / Business |
|---|---|---|---|
| 🛡️ **Admin & Creator** | `2311it010159@mallareddyuniversity.ac.in` | `Aniket@123` | Aniket Ramde |
| 🛡️ **Admin (Legacy)** | `admin@smartroad.ai` | `Admin@123` | SmartRoad Administrator |
| 🔧 **Service Provider** | `provider@smartroad.ai` | `Provider@123` | Ramesh Kumar (Apex Auto & Towing) |
| 🚗 **Driver (Primary)** | `driver@smartroad.ai` | `Driver@123` | Suresh Reddy (Hyundai Creta SX) |
| 🚗 **Driver (Demo)** | `rahul.driver@example.com` | `Password@123` | Rahul Driver |
| 🚗 **Driver (Legacy)** | `driver@smartroad.com` | `password123` | Suresh Reddy |
