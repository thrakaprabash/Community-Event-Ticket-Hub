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
- **100% Vercel Serverless Ready**: Both Frontend and Backend configured for instant deployment on Vercel with zero idle cold-sleeps.

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

## 🌐 Deploying Frontend & Backend to Vercel (Step-by-Step)

You deploy this project to Vercel as **two separate projects** from the same GitHub repo:

---

### Step 1: Deploy Backend to Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Configure:
   - **Project Name**: `event-hub-api` (or any name you like)
   - **Root Directory**: Click *Edit* and select **`server`**
   - **Framework Preset**: *Other*
4. Add **Environment Variables**:
   - `MONGODB_URI`: `<your MongoDB Atlas connection string>`
   - `NODE_ENV`: `production`
5. Click **Deploy**.
6. Copy your live Backend URL (e.g., `https://event-hub-api.vercel.app`).

---

### Step 2: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Import the same GitHub repository.
3. Configure:
   - **Project Name**: `event-hub-web` (or any name you like)
   - **Root Directory**: Click *Edit* and select **`client`**
   - **Framework Preset**: *Vite*
4. Add **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://event-hub-api.vercel.app/api` *(Your backend URL from Step 1 + `/api`)*
5. Click **Deploy**.
6. Your full platform is now live on Vercel! 🎉
