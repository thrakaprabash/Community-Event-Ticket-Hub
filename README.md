# 🎟️ Community Event Ticket Hub

> **Live Demo**: [https://community-event-ticket-hub-client.vercel.app](https://community-event-ticket-hub-client.vercel.app)  
> **Backend API**: [https://community-event-ticket-hub-server.vercel.app](https://community-event-ticket-hub-server.vercel.app)

A modern, multi-tenant MERN-stack platform for local community events—from university charity walks and tech meetups to outdoor musical shows.

Built with **React 18 (TypeScript)**, **TailwindCSS**, **Express (TypeScript)**, **MongoDB Atlas**, and **WSO2 Asgardeo B2B Multi-Tenancy Architecture**.

---

## 🌐 Live Application URLs

| Service | Live URL |
|---|---|
| 🖥️ **Frontend Web App** | [https://community-event-ticket-hub-client.vercel.app](https://community-event-ticket-hub-client.vercel.app) |
| ⚡ **Backend REST API** | [https://community-event-ticket-hub-server.vercel.app](https://community-event-ticket-hub-server.vercel.app) |

---

## ✨ Features

- **Public Discovery Page**: Full-text search and real-time filtering by category (Tech, Music, University, Sports), city, date range, and free/paid status.
- **Instant Ticket Pass Generation**: Seamless electronic ticket reservation with scannable Base64 QR code passes.
- **Analytics & Organizer Dashboard**: Interactive real-time visualizations powered by Recharts:
  - 📈 30-Day Registration volume line chart
  - 📊 Revenue by event bar chart
  - 🍩 Category distribution donut chart
  - 📋 Real-time attendee gate check-in roster
- **Multi-Tenant Organization Workspaces**: Isolated tenant workspaces for different event organizers (e.g. *WSO2*, *SLIIT*, *Dialog*, *Virtusa*).
- **100% Vercel Serverless**: High-availability frontend and serverless API with zero idle cold-sleeps.

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

## 🏢 Multi-Tenant Architecture (WSO2 Asgardeo B2B)

The application enforces strict data isolation using B2B organization tenant scoping:
- Each event organizer operates inside their own workspace identified by an `org_id` claim in their JWT authentication token.
- All event creation, ticket records, and revenue analytics are strictly scoped to the authenticated organization tenant (`{ organizationId: req.user.org_id }`).
- Public attendees can discover all public community events without crossing into private tenant analytics.
