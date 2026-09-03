# 🎟️ Community Event Ticket Hub

A modern, multi-tenant MERN-stack platform for local community events—from university charity walks and tech meetups to outdoor musical shows.

Built with **React (TypeScript)**, **TailwindCSS**, **Express (TypeScript)**, and **MongoDB Atlas**.

---

## ✨ Features

- **Public Discovery Page**: Full-text search and real-time filtering by category (Tech, Music, University, Sports), city, date range, and free/paid status.
- **Instant Ticket Pass Generation**: Seamless electronic ticket reservation with scannable Base64 QR code passes.
- **Analytics & Organizer Dashboard**: Interactive real-time visualizations powered by Recharts:
  - 📈 30-Day Registration volume line chart
  - 📊 Revenue by event bar chart
  - 🍩 Category distribution donut chart
  - 📋 Real-time attendee gate check-in roster
- **Multi-Tenant Organization Workspaces**: Isolated tenant workspaces for different event organizers (e.g. *TechConf Global*, *SoundWave Productions*, *University Council*).
- **Vercel & Render.com Deployments**: Pre-configured with `vercel.json` for frontend and `render.yaml` for backend deployment with automated GitHub CI/CD on every push.

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
Open two terminals:
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

## 🏢 Multi-Tenant Workspace & Authentication

The application features workspace tenant isolation. Organizers can authenticate into their dedicated workspace to view only their organization's events, revenues, and attendees. 

1. **Development Mode**: Click any organization profile (*TechConf Global*, *SoundWave Productions*, *University Council*) on the sign-in page to test tenant switching instantly.
2. **Production Mode (Optional Asgardeo/OIDC)**: Configure `ASGARDEO_JWKS_URI` in `server/.env` with your OAuth2 JWKS endpoint to cryptographically validate live JWT tokens.

---

## 🌐 Deployment Guide (Vercel + Render.com)

### 1. Deploy Backend to Render.com (Free Tier)
1. Go to [render.com](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
4. Add Environment Variables in the Render dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
   - `CLIENT_ORIGIN`: Your Vercel frontend URL (e.g., `https://your-project.vercel.app`)
5. Copy your Render service URL (e.g., `https://event-hub-api.onrender.com`).

### 2. Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Import this GitHub repository.
3. Settings:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
4. Add Environment Variable in the Vercel dashboard:
   - `VITE_API_BASE_URL`: `https://event-hub-api.onrender.com/api` (your Render URL + `/api`)
   - `VITE_REDIRECT_URL`: `https://your-project.vercel.app`
5. Click **Deploy**. Vercel will build the frontend and provide your live URL.
