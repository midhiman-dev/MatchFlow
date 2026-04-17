# Google Services Adoption in MatchFlow

This document outlines the specific Google SDKs, APIs, and Cloud services integrated into the MatchFlow MVP. 

Our application architecture relies heavily on Google's ecosystem to provide real-time performance, scalability, and intelligent assistance for high-density stadium environments.

## 1. Firebase (Realtime Database & Auth)
**SDK Used:** `firebase` (v12+) — specifically `firebase/app`, `firebase/database`, `firebase/auth`.
**Code Evidence:** `apps/matchflow/src/lib/firebase.ts`

**Usage:**
- **Firebase Auth:** Handles anonymous session generation for fans entering the stadium to provide instant utility without complex onboarding.
- **Firebase Realtime Database (RTDB):** Powers the core "Live State" of the system. Stadium density, path congestion, and emergency closures are synchronized continuously to clients via RTDB listeners, ensuring that both Fan routing and Operator Heatmaps rely on sub-second updates.

## 2. Google Generative AI (Gemini)
**SDK Used:** `@google/generative-ai`
**Code Evidence:** `apps/matchflow/src/lib/gemini.ts`

**Usage:**
- **Smart Recommendations:** Uses `gemini-1.5-flash` to process localized stadium logic. When a fan asks for a route, the AI consumes spatial data (zone densities) and match context (e.g., "Innings Break") to provide localized, safe "Next Best Action" text recommendations. 

## 3. Google Cloud Run
**Deployment Target:** Google Cloud Platform (us-central1)
**Infrastructure Evidence:** 
- `apps/matchflow/Dockerfile`
- The LIVE DEMO runs on a Cloud Run container URL (e.g., `https://matchflow-507221700864.us-central1.run.app`).

**Usage:**
- The Vite Production build node container is fully deployed to Google Cloud Run, leveraging GCP's auto-scaling to handle the massive surge spikes expected at major sporting events like those experienced during an innings break.

---

*This level of integration ensures that the MatchFlow prototype is rooted in enterprise-grade infrastructure, aligning perfectly with realistic deployment strategies for massive physical venues.*
