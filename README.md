# Media Portal Application

Full-stack web application with Angular (Frontend), Node.js (Backend), and Database (MySQL or SQLite).

## Features
- **Admin Dashboard**: Manage users, view statistics, delete users.
- **User Dashboard**: Upload media, view personal uploads.
- **Media Upload**: Support for Images, Videos, and PDFs.
- **Authentication**: Secure JWT-based login with Role-Based Access Control (RBAC).

## Quick Start (Local)
The application is pre-configured to use **SQLite** for instant local execution.

1. Navigate to `backend`:
   ```bash
   cd backend
   npm install
   npm start
   ```
   The backend runs on `http://localhost:3000` and also serves the frontend.

2. Access the app:
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

## Database
- Default: **SQLite** (local file `database/media_portal.sqlite`).
- To switch to **MySQL** (e.g. AWS RDS), update `backend/config/db.js` to require `mysql2` and configure `.env`.

## Default Credentials
- **Admin**: `admin@example.com` / `password` (if seeded) or check `database/schema.sqlite.sql` for initial insert.
  *(Note: The `schema.sqlite.sql` inserts a hashed password. You may need to create a new user via API or use a known hash.)*

## Development
- Frontend source: `frontend/`
- Backend source: `backend/`
