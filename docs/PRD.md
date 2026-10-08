# Product Requirements Document (PRD) — Pravaha AI
### *MOVEMENT • SUPPORT • SAFETY*
**Author & Lead Developer:** Aniket Ramde (Department of Information Technology, Malla Reddy University)  
**Version:** 2.0.0  
**Status:** Active Production  
**Document Revision Date:** October 2026  

---

## 1. 📌 Executive Summary
**Pravaha AI** is a real-time, location-aware vehicle breakdown assistance and intelligent service dispatch ecosystem. It unites stranded drivers, verified mechanics/towing operators, and system administrators through interactive telemetry, heuristic failure classification, and automated geographic matching.

By removing manual phone calls, uncertain arrival times, and vague location descriptions, Pravaha AI accelerates roadside emergency assistance from an industry average of 45–60 minutes down to a 15-minute target response window.

---

## 2. 🚨 Problem Statement
1. **Ambiguous Highway Locations**: Drivers experiencing breakdowns on expressways or outer ring roads often struggle to provide precise mile markers or landmark descriptions to breakdown dispatchers.
2. **Incompatible Equipment Dispatch**: Towing companies frequently arrive with improper equipment (e.g., standard tow cables instead of flatbeds for all-wheel-drive vehicles, or lacking heavy-duty booster cables for commercial batteries).
3. **Friction in Dispatch Coordination**: Traditional breakdown assistance relies on multi-hop phone trees between insurance call centers, regional towing dispatchers, and independent garage operators.
4. **Lack of Live Telemetry**: Drivers are left without transparency regarding mechanic dispatch status, live ETA, or verified technician credentials.

---

## 3. 🎯 Vision & Core Objectives
| Objective | Metric / KPI |
|---|---|
| **Rapid Response** | Cut average dispatch coordination latency to under 60 seconds. |
| **Accurate Equipment Match** | Achieve 95%+ first-visit resolution rate by predicting diagnostic equipment via AI prior to dispatch. |
| **Location Precision** | Lock GPS highway coordinates within 10 meters using high-resolution browser & device telemetry. |
| **Trust & Verification** | Guarantee 100% verified service providers with background checks, clear pricing, and customer ratings. |

---

## 4. 👥 User Personas

### Persona A: Stranded Driver (Rahul)
- **Profile**: Daily highway commuter or interstate driver.
- **Pain Points**: Stranded on an unfamiliar road with an overheated radiator or blowout tire; anxious about safety; needs transparent arrival estimates.
- **Goals**: One-touch breakdown report, automatic GPS detection, clear tracking of the approaching technician, verified credentials.

### Persona B: Verified Service Provider (Ramesh Kumar - Apex Auto)
- **Profile**: Owner/operator of a local garage or mobile towing service.
- **Pain Points**: Missed job opportunities, idle trucks, customer disputes over flat rates vs. mileage.
- **Goals**: Simple mobile interface to toggle On-Duty/Off-Duty, accept requests within a 15–25 km radius, view vehicle make and symptoms beforehand, navigate directly to coordinates.

### Persona C: Platform Administrator (Aniket Ramde)
- **Profile**: System administrator and safety supervisor.
- **Pain Points**: Platform visibility, tracking offline vs. online mechanics, validating system health across microservices and cloud databases.
- **Goals**: Centralized control tower monitoring active dispatches, verifying technician credentials, inspecting audit trails, and monitoring MongoDB Atlas cluster metrics.

---

## 5. 🛠️ Functional Requirements (FR)

### Module 1: Identity & Role-Based Access Control (RBAC)
- **FR-1.1**: The system must support three distinct roles: `ROLE_DRIVER`, `ROLE_SERVICE_PROVIDER`, and `ROLE_ADMIN`.
- **FR-1.2**: Passwords must be hashed using industry-standard BCrypt before storage.
- **FR-1.3**: Authentication must issue HMAC-SHA512 signed JSON Web Tokens (JWT) containing subject ID, role, and expiration timestamp.
- **FR-1.4**: Users can register as Drivers (with vehicle details: make, model, year, license plate) or Service Providers (with business name, workshop address, base fee).

### Module 2: Driver Breakdown Wizard & Diagnostics
- **FR-2.1**: One-click reporting across 6 standardized breakdown categories:
  1. `TOWING` (Flatbed & Wheel-lift)
  2. `BATTERY_JUMPSTART` (12V Booster & Alternator Check)
  3. `TYRE_ASSISTANCE` (Puncture & Stepney Swap)
  4. `FUEL_DELIVERY` (Petrol & Diesel On-Demand)
  5. `LOCKOUT_ASSISTANCE` (Non-destructive Key Recovery)
  6. `VEHICLE_DIAGNOSTICS` (OBD-II Computer Telemetry)
- **FR-2.2**: Device/browser GPS coordinate detection with fallback reverse-geocoded address display.
- **FR-2.3**: AI Symptom Analysis triggering FastAPI heuristic classification to predict root cause, severity rating (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and required equipment.

### Module 3: Geodesic Provider Discovery & Matching
- **FR-3.1**: Compute Haversine spherical distance between driver coordinates and all registered on-duty service providers:
  $$\text{Distance} = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1\cos\phi_2\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
- **FR-3.2**: Filter providers within a 15 km default radius (expandable to 25 km).
- **FR-3.3**: Rank providers based on composite multi-factor score: distance proximity, provider star rating, and service compatibility.

### Module 4: Live Telemetry & Mission State Machine
- **FR-4.1**: Manage dispatch progression through rigid state machine states:
  $$\text{REQUESTED} \longrightarrow \text{ACCEPTED} \longrightarrow \text{EN\_ROUTE} \longrightarrow \text{ON\_SCENE} \longrightarrow \text{COMPLETED}$$
- **FR-4.2**: Allow graceful cancellation with transition to `CANCELLED` prior to arrival.
- **FR-4.3**: Interactive Leaflet / OpenStreetMap visual tracking showing driver pin, provider location, and route line.
- **FR-4.4**: Real-time polling updates every 5 seconds synchronizing both driver and provider screens.

### Module 5: Provider Hub & Job Queue
- **FR-5.1**: Live On-Duty / Off-Duty toggle that instantly adds or removes the provider from the spatial discovery radar.
- **FR-5.2**: Incoming job queue with audio/visual notification, driver contact phone, breakdown category, vehicle model, and distance.
- **FR-5.3**: 1-click status transitions (Accept, En Route, On Scene, Completed).
- **FR-5.4**: Integrated Google Maps deep-link for instant turn-by-turn navigation to driver GPS coordinates.

### Module 6: Review, Rating & Historical Auditing
- **FR-6.1**: Post-service modal prompting driver to submit a 1-to-5 star rating and optional text review.
- **FR-6.2**: Dynamically recalculate rolling provider rating and total jobs completed in MongoDB Atlas.
- **FR-6.3**: Comprehensive history ledger archiving all past dispatches with timestamps, resolved notes, and fees.

---

## 6. 🛡️ Non-Functional Requirements (NFR)

| Area | Requirement |
|---|---|
| **Performance** | API response times $< 200\text{ ms}$ for standard queries; $< 400\text{ ms}$ for AI diagnostic and proximity queries. |
| **Availability** | 99.9% uptime backed by 3-node MongoDB Atlas replica set failover on Google Cloud Platform. |
| **Security** | Zero plaintext passwords; JWT token validation on all protected `/api/driver/**`, `/api/provider/**`, and `/api/admin/**` routes. |
| **Scalability** | Stateless Spring Boot backend supporting horizontal replication; stateless FastAPI AI worker. |
| **Cross-Platform Compatibility** | Responsive web client supporting desktop, tablet, and mobile browsers; companion React Native Expo mobile app. |

---

## 7. 🔮 Future Enhancements (Roadmap)
- **OBD-II Bluetooth Telemetry**: Direct streaming of Diagnostic Trouble Codes (DTCs) from vehicular dongles directly to the AI service.
- **Automated Payment Gateway**: Integration of Razorpay / Stripe for escrow milestone payouts upon driver confirmation of completion.
- **Offline SMS Fallback**: Automated Twilio SMS coordinate lock for areas with dead 4G/5G mobile data coverage.
