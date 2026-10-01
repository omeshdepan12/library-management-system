# library-management-system

A full-stack Library Management System with a React frontend and Express backend.

## Project structure

- `frontend/` - React + Tailwind + Framer Motion dashboard
- `backend/` - Express API with JSON persistence

## Quick start

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. In another terminal, install frontend dependencies:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open:
   ```text
   http://localhost:3000
   ```

## Demo login

- Email: `owner@library.com`
- Password: `ChangeMe@12345`

## API base

- `http://localhost:5000/api`

## Notes

The backend stores app data in `backend/data/db.json` and provides CRUD endpoints for books and members, plus dashboard and reporting endpoints.

