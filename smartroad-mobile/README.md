# 📱 Pravaha AI Mobile App (React Native & Expo)

Cross-platform mobile application for **Pravaha AI - Intelligent On-Road Breakdown & Dispatch Ecosystem**.

Built with **React Native (Expo SDK 57)**, featuring role-based portals for **Stranded Drivers** and **Emergency Service Providers**, connected to the Spring Boot 3 Core Backend and FastAPI AI Microservice.

---

## 🚀 Key Features

### 🚗 Driver Portal
- **One-Touch Emergency SOS Dispatch**: Scan a 25km radius for verified rescue mechanics.
- **Breakdown Problem Catalog**: Towing, Flat Tire, Dead Battery, Out of Fuel, Lockout, and OBD-II Diagnostics.
- **Live Device GPS Telemetry**: Real-time satellite fix with reverse geocoding and fallback corridor coordinates.
- **FastAPI AI Diagnostics Integration**: Heuristic symptom analysis with severity ratings, root-cause assessment, and required rig recommendations.
- **Live Dispatch Telemetry Stepper**: Real-time mission tracker (`REQUESTED` ➔ `ACCEPTED` ➔ `EN_ROUTE` ➔ `ON_SCENE` ➔ `COMPLETED`).
- **Direct Phone Contact**: One-tap phone calling to the assigned rescue unit.
- **My Garage & Audit Trail**: Register vehicles (make, model, license plate) and review historical assistance records with star ratings and reviews.

### 🔧 Service Provider Hub
- **On-Duty / Off-Duty Availability Switch**: Real-time toggle to broadcast availability across the geospatial radar.
- **Real-Time Incoming Dispatch Queue**: View stranded motorist contact, issue category, vehicle make/model, and GPS location.
- **Active Engagement Controller**: Transition status through En Route, On Scene, and Completed with turn-by-turn navigation launcher.
- **Performance KPIs**: Track live ratings, completed jobs, and base dispatch fee.

### 🌐 Network & Testing Utilities
- **Built-in Backend Host Switcher**: Easily toggle between:
  - Local LAN IP (`http://172.19.50.41:8080/api`) — for testing on physical iOS & Android devices using Expo Go on same Wi-Fi.
  - Android Emulator (`http://10.0.2.2:8080/api`).
  - Localhost (`http://localhost:8080/api`).
  - Custom server URL input.
- **Live Ping Diagnostic**: Real-time latency checker verifying Spring Boot backend connectivity.
- **One-Tap Demo Credentials**: Instant autofill buttons for Driver and Provider demo accounts.

---

## 🛠️ How to Run

### 1. Install Dependencies (Already Completed)
```bash
cd smartroad-mobile
npm install
```

### 2. Start the Expo Development Server
```bash
npm start
```
or
```bash
npx expo start --clear
```

### 3. Open on Your Phone or Emulator
- **Physical Phone (iOS or Android)**:
  1. Install the **Expo Go** app from App Store or Google Play Store.
  2. Ensure your phone is connected to the same Wi-Fi network as this computer.
  3. Scan the QR code displayed in the terminal with your phone's camera (iOS) or Expo Go app (Android).
- **Android Emulator**:
  - Press `a` in the terminal to launch on a running Android emulator.
- **iOS Simulator** (macOS):
  - Press `i` in the terminal.
- **Web Browser**:
  - Press `w` in the terminal to preview in the web browser.

---

## ⚙️ Backend Connectivity Note
- By default, the app is pre-configured to connect to your machine's LAN IP (`172.19.50.41:8080/api`).
- If your IP changes or you test on Android Emulator, simply tap the **API** button in the top header or use the **Settings** tab to change the server address without modifying code.
