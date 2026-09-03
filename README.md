# 🎟️ Community Event Ticket Hub

A centralized, multi-tenant MERN-stack platform for local events—from university charity walks and tech meetups to outdoor musical shows.

Built with **React (TypeScript)**, **Express**, **MongoDB Atlas**, **WSO2 Asgardeo B2B Identity Management**, and **WSO2 Choreo CI/CD**.

---

## ✨ Features

- **Public Discovery Page**: Full-text search and real-time filtering by category (Tech, Music, University, Sports), city, date range, and free/paid status.
- **Mock Ticket Registration**: Instant ticket pass generation with dynamic Base64 QR code rendering without real payment gateway friction.
- **Chart-Heavy Organizer Dashboard**: Real-time Recharts visualizations:
  - 📈 30-Day Registration volume line chart
  - 📊 Revenue by event bar chart
  - 🍩 Category distribution donut chart
  - 📋 Real-time attendee gate check-in roster
- **WSO2 Asgardeo B2B Multi-Tenancy**: Isolated sub-organization tenant workspaces for different event organizers (e.g. *TechConf Global*, *SoundWave Productions*, *University Council*).
- **WSO2 Choreo CI/CD**: Cloud-native continuous integration and deployment with `.choreo/` descriptors.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ or 20+
- MongoDB instance (MongoDB Atlas free M0 cluster or local MongoDB on `mongodb://127.0.0.1:27017/eventhub`)

### 2. Installation
Install dependencies for both backend and frontend:
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### 3. Seed Realistic Test Data
Populate MongoDB with sample events and realistic ticket purchase trends for charts:
```bash
cd server
npm run seed
```

### 4. Run Development Servers
Open two terminals or run concurrently:
```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2: Frontend App (Port 5173)
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🏢 WSO2 Asgardeo B2B Setup Guide

1. Sign up for a free account at [asgardeo.io](https://asgardeo.io).
2. Create your root organization (e.g., `community-event-hub`).
3. Under **Applications**, create a Single Page Application (SPA) for attendees (`http://localhost:5173`).
4. Under **Organizations**, create sub-organizations for event organizers (e.g., `TechConf-Inc`, `SoundWave-Productions`).
5. Configure `ASGARDEO_JWKS_URI` in `server/.env` with your organization endpoint:
   `https://api.asgardeo.io/t/<your-root-org>/oauth2/jwks`

---

## ☁️ WSO2 Choreo CI/CD Auto-Deployment Guide

1. Log into [console.choreo.dev](https://console.choreo.dev) and create a project: `community-event-ticket-hub`.
2. Connect your GitHub repository.
3. Add **Backend Component**:
   - Component Type: **REST API / Service**
   - Path: `/server`
   - Buildpack: **NodeJS**
   - Port: `5000`
4. Add **Frontend Component**:
   - Component Type: **Web Application**
   - Path: `/client`
   - Buildpack: **NodeJS**
   - Build command: `npm run build`
   - Output directory: `dist`
5. Every `git push` to `main` automatically triggers Choreo to build and deploy the latest live build!
