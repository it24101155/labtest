# MERN Item Manager

A full-stack Item Management system built with the MERN (MongoDB, Express, React, Node) stack.

## Structure
- `Backend/`: Express server and MongoDB models.
- `Frontend/`: React application built with Vite.

## Deployment Guide

### 1. Backend (Render.com)
1. Log in to [Render.com](https://render.com).
2. Create a **New Web Service**.
3. Connect this GitHub repository.
4. **Root Directory:** `Backend`
5. **Environment:** `Node`
6. **Start Command:** `node server.js`
7. **Environment Variables:**
   - `MONGO_URI`: (Your MongoDB connection string)
   - `PORT`: `5000`

### 2. Frontend (Netlify)
1. Log in to [Netlify.com](https://netlify.com).
2. Create a **New site from Git**.
3. Connect this GitHub repository.
4. **Base directory:** `Frontend`
5. **Build command:** `npm run build`
6. **Publish directory:** `dist`
7. **Environment Variables:**
   - `VITE_API_URL`: (The URL of your live Render backend, e.g., `https://your-app.onrender.com/api`)

---

## Local Development
1. Clone the repository.
2. Install dependencies in both folders:
   ```bash
   cd Backend && npm install
   cd ../Frontend && npm install
   ```
3. Create `.env` files in both folders (use `.env.example` as a template).
4. Run locally:
   - Backend: `npm run dev`
   - Frontend: `npm run dev`
