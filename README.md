# LinguAfrika - Language Learning Platform

A full-stack monorepo for learning African languages (Yoruba, Hausa, Igbo, Efik).

## 🏗️ Monorepo Structure

```
lla/
├── frontend/          # React + TypeScript + Vite + Tailwind CSS
├── backend/           # Node.js + Express + MongoDB + Socket.IO
└── package.json       # Root workspace configuration
```

## 🚀 Quick Start

### 1. Install All Dependencies

From the root directory:

```bash
npm install
```

This will install dependencies for both frontend and backend workspaces.

### 2. Set Up Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**Frontend:**
The frontend uses Vite's proxy configuration (already set up in `vite.config.ts`).

### 3. Start Both Servers

From the root directory:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000 (Vite dev server)
- **Backend**: http://localhost:5000 (Express API)

### 4. Start Individual Services

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## 📦 Workspaces

This project uses **npm workspaces** for monorepo management:

- `frontend` - React application
- `backend` - Express API server

## 🛠️ Development

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Port**: 3000

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.IO
- **Port**: 5000

## 📝 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build both projects
- `npm install` - Install all workspace dependencies

### Frontend
- `npm run dev --workspace=frontend` - Start dev server
- `npm run build --workspace=frontend` - Build for production

### Backend
- `npm run dev --workspace=backend` - Start dev server (with watch)
- `npm start --workspace=backend` - Start production server

## 🔧 Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or cloud instance)

## 📚 Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## 🎯 Features

- ✅ User authentication (JWT)
- ✅ Course management
- ✅ Lesson tracking
- ✅ Progress monitoring
- ✅ Community features
- ✅ AI Chat
- ✅ Quiz system
- ✅ Real-time updates (Socket.IO)


