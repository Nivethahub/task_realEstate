# Nestora — Real Estate Listing Platform

Nestora is a full-stack real-estate listing application. Users can browse and filter property listings, register and sign in, create and manage their own listings, and send inquiries to property owners.

> **Local development setup:** This guide uses a locally installed PostgreSQL server. Docker is not required or used.

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup on Windows](#setup-on-windows)
- [Environment variables](#environment-variables)
- [Database and Prisma](#database-and-prisma)
- [Run the application](#run-the-application)
- [Available commands](#available-commands)
- [API overview](#api-overview)
- [Authentication and security](#authentication-and-security)
- [Implementation notes and limitations](#implementation-notes-and-limitations)
- [Troubleshooting](#troubleshooting)

## Features

### Property discovery
- Browse available property listings.
- Filter by city/locality, minimum and maximum price, bedrooms, property type, and sale/rent listing type.
- Sort by price or creation date.
- Paginated property results.
- View property details and similar property suggestions.

### User accounts
- Register and sign in with email and password.
- Password hashing with bcrypt.
- JWT access tokens and refresh-token handling.
- Logout endpoint to revoke a supplied refresh token.
- Protected API routes using bearer access tokens.

### Listing management
- Authenticated users can create property listings.
- Listing owners can edit and archive their own listings.
- Delete is implemented as a soft archive (`isArchive = true`), not a physical database deletion.
- Property records include location, price, bedrooms, bathrooms, area, property type, image URLs, and amenities.

### Inquiries and dashboard
- Signed-in users can send inquiries about listings.
- Users can view inquiries they sent and inquiries received for their listings.
- Dashboard for managing the signed-in user's active listings.
- Recently viewed properties are stored in browser local storage per user.

## Technology stack

| Area | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS 3 |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL 16 (local installation) |
| ORM and migrations | Prisma 6 |
| Validation | Zod |
| Authentication | JSON Web Token, bcryptjs |
| API documentation | Swagger UI / OpenAPI |
| Middleware | Helmet, CORS, express-rate-limit, Morgan |

## Project structure

```text
real-estate-listing-platform/
├── backend/
│   ├── prisma/
│   │   ├── migrations/       # Database migration history
│   │   ├── schema.prisma     # PostgreSQL data model
│   │   └── seed.ts           # Demo user and test listings
│   ├── src/
│   │   ├── config/           # Environment, Prisma, Swagger configuration
│   │   ├── controllers/      # Authentication, property, inquiry logic
│   │   ├── middleware/       # Authentication and error handling
│   │   ├── routes/           # Express API routes
│   │   ├── utils/            # Shared utilities
│   │   └── validators/       # Zod validation schemas
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/app/              # Next.js pages and layouts
│   ├── src/components/       # Header, forms, cards, dashboard, etc.
│   ├── src/lib/              # API helpers
│   ├── src/types/            # Frontend TypeScript types
│   ├── .env.example
│   └── package.json
├── package.json              # npm workspaces and root scripts
├── package-lock.json
└── README.md
```

## Prerequisites

Install these before setup:

1. **Node.js 20 or later** (LTS recommended). npm is included with Node.js.
2. **PostgreSQL 16** (or a compatible supported PostgreSQL version) installed and running on your computer.
3. **pgAdmin** (optional) or `psql`, to create and inspect the database.
4. **Visual Studio Code** or another code editor (optional).

No Docker installation is required.

## Setup on Windows

Run the following commands in PowerShell.

### 1. Extract the project and open its root folder

Open the folder that contains the root `package.json`:

```powershell
cd "D:\path\to\real-estate-listing-platform updated"
```

### 2. Install Node.js dependencies

```powershell
npm install
```

This installs the root workspace dependencies and the dependencies for both `backend` and `frontend`.

### 3. Create a PostgreSQL database

Make sure the PostgreSQL Windows service is running. You can create the database using pgAdmin (Databases → Create → Database) or by connecting with `psql` and running:

```sql
CREATE DATABASE real_estate_db1;
```

The database name must match the database name in `backend/.env`.

### 4. Create environment files

From the project root, run:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
```

Open `backend/.env` and set the PostgreSQL username/password for your local installation. Replace the example JWT secret with a private random value of at least 32 characters.

The backend environment file should follow this format:

```env
NODE_ENV=development
PORT=5001
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/real_estate_db1?schema=public"
JWT_SECRET="replace-with-a-private-random-secret-at-least-32-characters"
JWT_EXPIRES_IN=2h
CLIENT_URL=http://localhost:3000
```

In `frontend/.env.local`, use:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Do not commit or send `.env` or `.env.local` files. They contain machine-specific credentials. Share only the `.env.example` templates.

## Environment variables

### Backend — `backend/.env`

| Variable | Purpose | Local setting |
|---|---|---|
| `NODE_ENV` | Runtime mode | `development` |
| `PORT` | Express API port | `5001` |
| `DATABASE_URL` | PostgreSQL connection URL | Local `real_estate_db1` database |
| `JWT_SECRET` | Secret used to sign access tokens | Private random string, 32+ characters |
| `JWT_EXPIRES_IN` | Token lifetime setting validated by the environment schema | `2h` example; see note below |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:3000` |

### Frontend — `frontend/.env.local`

| Variable | Purpose | Local setting |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL used by the frontend | `http://localhost:5001/api` |

`NEXT_PUBLIC_` variables are exposed to the browser. Do not put secrets in them.

## Database and Prisma

Run these commands from the project root after creating the database and configuring `backend/.env`:

### 1. Generate Prisma Client

```powershell
npm run db:generate
```

### 2. Apply checked-in migrations

```powershell
npm run db:migrate
```

The repository includes the initial schema migration and a migration adding `Property.isArchive`.

### 3. Add demo and sample data (optional)

```powershell
npm run db:seed
```

The seed script creates/reuses a demo account and sample listings, then generates synthetic property records toward a target of approximately 50,000 records. This is test/performance data, not genuine real-estate inventory. Seeding can take time and should be done only in a development database.

Demo account:

| Field | Value |
|---|---|
| Email | `demo@realestate.test` |
| Password | `Demo@12345` |

Use demo credentials only in a local development environment. If you do not need the large synthetic dataset, do not run the seed script unchanged; register an account and create a small number of listings manually, or adjust the seed target in `backend/prisma/seed.ts` first.

## Run the application

From the project root:

```powershell
npm run dev
```

This starts the backend and frontend together.

| Service | Local URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend health check | http://localhost:5001/health |
| Swagger UI | http://localhost:5001/api-docs |
| OpenAPI JSON | http://localhost:5001/api-docs.json |

To run them separately, open two PowerShell terminals at the project root.

Terminal 1 — backend:

```powershell
npm run dev:backend
```

Terminal 2 — frontend:

```powershell
npm run dev:frontend
```

Keep the frontend URL in `backend/.env` (`CLIENT_URL`) aligned with the actual frontend origin. If port 3000 is occupied and Next.js starts on 3001, change `CLIENT_URL` to `http://localhost:3001` and restart the backend.

## Available commands

Run from the project root:

| Command | Purpose |
|---|---|
| `npm install` | Install workspace dependencies |
| `npm run dev` | Start frontend and backend together |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Apply/create development migrations |
| `npm run db:seed` | Create demo data and synthetic listings |
| `npm run build` | Build backend and frontend |

Backend-specific scripts can also be run from the `backend` folder: `npm run dev`, `npm run build`, `npm run start`, `npm run prisma:generate`, `npm run prisma:migrate`, and `npm run prisma:seed`.

## API overview

Base URL: `http://localhost:5001/api`

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a user |
| POST | `/auth/login` | Public | Log in and receive tokens |
| POST | `/auth/refresh` | Refresh token | Rotate refresh token and issue tokens |
| POST | `/auth/logout` | Refresh token | Revoke refresh token |
| GET | `/auth/me` | Bearer token | Get current user |

### Properties

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/properties` | Public | Browse, filter, sort and paginate listings |
| GET | `/properties/mine` | Bearer token | Get current user's active listings |
| POST | `/properties` | Bearer token | Create a listing |
| GET | `/properties/:id` | Public | Get property details |
| GET | `/properties/:id/similar` | Public | Get similar listings |
| PATCH | `/properties/:id` | Bearer token | Update an owned listing |
| DELETE | `/properties/:id` | Bearer token | Archive an owned listing |

### Inquiries

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/inquiries/:propertyId` | Bearer token | Send inquiry to listing owner |
| GET | `/inquiries/mine` | Bearer token | View inquiries sent by current user |
| GET | `/inquiries/received` | Bearer token | View inquiries received for user's listings |

Protected requests use:

```http
Authorization: Bearer <access-token>
```

Full request/response schemas are available in Swagger UI at `http://localhost:5001/api-docs` when the backend is running.

## Authentication and security

- Passwords are hashed with `bcryptjs`.
- Access tokens are JWTs.
- Refresh tokens are stored as hashes in the database and rotated by the refresh endpoint.
- Protected routes use authentication middleware.
- Zod validates incoming request data.
- Helmet adds HTTP security headers.
- CORS is restricted to the configured `CLIENT_URL`.
- Express rate limiting is applied to API traffic.
- Listing update/archive operations verify ownership.

**Configuration note:** In the current backend code, the access-token lifetime is hardcoded in the authentication controller. `JWT_EXPIRES_IN` is validated by the environment schema but changing it alone does not change the token lifetime. Verify the authentication controller before relying on a different expiry value.

## Implementation notes and limitations

- Property images are represented as URLs; a dedicated binary image-upload/storage service is not included.
- Recently viewed history is stored in browser local storage and is browser/device-specific.
- Most seeded listings are synthetic test data and must not be represented as real listings.
- The project package scripts do not define a dedicated automated test suite.
- A dedicated administrator role/panel is not included in the current implementation.
- Before production deployment, configure HTTPS, managed secrets, secure token storage, database backups, monitoring, and production-grade image storage.

## Troubleshooting

### CORS error
- Confirm backend is running on port `5001`.
- Confirm `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5001/api`.
- Confirm `backend/.env` has `CLIENT_URL=http://localhost:3000` (or `3001` if Next.js is actually using that port).
- Restart both servers after changing environment files.

### Database connection error
- Confirm the PostgreSQL Windows service is running.
- Confirm database `real_estate_db1` exists.
- Check the username, password, host and port in `backend/.env`.
- Ensure the database user has permission to access the database.

### Prisma Client or schema errors

```powershell
npm run db:generate
npm run db:migrate
```

### Port already in use
Stop the process using port `3000` or `5001`, or configure a different port and keep `CLIENT_URL` and `NEXT_PUBLIC_API_URL` consistent.

---

**Project:** Nestora  
**Type:** Full-stack real-estate listing platform  
**Stack:** Next.js, React, Node.js, Express, TypeScript, PostgreSQL, Prisma
