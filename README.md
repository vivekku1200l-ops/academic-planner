# Intelligent Academic Planner — Global Deployment

This version is prepared for public deployment.

## Architecture
- Frontend: React + Vite
- Backend: Express
- Database: PostgreSQL
- Deployment: Render Blueprint

## Deploy

1. Put this project in a GitHub repository.
2. Create a Render account and connect GitHub.
3. In Render, create a **New Blueprint Instance** and select the repository.
4. Render will create the API, static frontend, and PostgreSQL database from `render.yaml`.
5. During the first setup, Render asks for `VITE_API_URL`.
6. After the API service is created, use its public `https://...onrender.com/api` URL as `VITE_API_URL`.
7. Redeploy the frontend.

Render free web services can sleep after inactivity, so the first request may take a little longer. Render's free Postgres is suitable for a hackathon/demo but currently expires after 30 days.

## Local development

Backend requires PostgreSQL and:
```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME"
cd backend
npm install
npm start
```

Frontend:
```powershell
cd frontend
npm install
npm run dev
```
