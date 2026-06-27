#  CRM — Backend

Server-side implementation for the  CRM demo application. This repository provides a Node.js + Express API that handles authentication (JWT + refresh tokens), customer CRUD operations, dashboard summaries, and a contact form endpoint. The server uses PostgreSQL for persistence and includes automatic database creation and schema initialization on startup.

---

## Features

- Authentication: register, login, refresh, logout, and a protected `me` endpoint.
- JWT-based access tokens and refresh tokens (refresh token stored in an HTTP-only cookie).
- User management: create and lookup users (seed user created at startup if missing).
- Customer management: create (public/Contact form), read (list), update, and delete customers.
- Dashboard summary metrics aggregated from the `customers` table.
- Database initialization: automatically creates the configured database (if missing) and ensures tables exist on startup.
- Basic request validation performed in controllers (manual checks).
- Error handling per-route with appropriate HTTP status codes.
- Middleware: authentication middleware that verifies Bearer JWTs and attaches a safe user object to `req.user`.
- Docker Compose support (see repository `docker-compose.yml`).

Not implemented: dedicated migration tooling (e.g., Flyway/Knex/Migrations), structured logging library (uses console.log), advanced validation library (no Joi/Zod), file upload endpoints, or a health-check route (the server logs a health URL but no `/health` route was found).

---

## Tech Stack

- Runtime: Node.js
- Language: JavaScript (CommonJS)
- Framework: Express
- Database: PostgreSQL
- DB Driver: `pg` (node-postgres)
- Authentication: `jsonwebtoken` (JWT) + `cookie-parser` for refresh token cookie
- Password hashing: `bcryptjs`
- Environment: `dotenv`
- Dev tooling: `nodemon`
- Containerization: `docker-compose` (project-level)

No dedicated logging, validation, or testing libraries are present in the codebase.

---

## Project Structure

Key files and folders:

- `src/index.js` — Application entrypoint; configures Express, binds routes, performs DB initialization, and starts the server.
- `src/config/config.js` — Loads environment variables and exposes runtime configuration values.
- `src/config/ensureDatabase.js` — Connects to the Postgres server (default `postgres` database) and creates the configured database if it does not exist.
- `src/config/db.js` — Creates a `pg` Pool, checks connection, and ensures the `users` and `customers` tables exist.
- `src/routes/` — Express route definitions:
  - `auth.routes.js` — `/api/auth` routes (register/login/refresh/logout/me)
  - `customer.routes.js` — `/api/customersdata` (public POST) and `/api/customers` (protected GET/PUT/DELETE)
  - `dashboard.routes.js` — `/api/dashboard` (protected summary)
- `src/controllers/` — Controllers validating input, invoking services/models, and returning HTTP responses.
- `src/services/` — Business logic and helpers:
  - `auth.service.js` — Login, refresh token creation, and register delegation.
  - `user.service.js` — User lookups, creation (password hashing), safe user projection, and seed user initialization.
- `src/models/` — Data access using `pg`:
  - `user.model.js` — queries for users
  - `customer.model.js` — CRUD queries for customers
  - `dashboard.model.js` — aggregates for dashboard summary
- `src/middleware/auth.middleware.js` — Verifies `Authorization: Bearer <token>`, checks token signature against `JWT_SECRET`, loads user and attaches `req.user`.
- `package.json` — scripts (`dev`, `start`), dependencies.
- `docker-compose.yml` (project root) — multi-service composition for `postgres`, `backend`, and `frontend`.
- `.env` (in `server/`) — configuration variables (not committed to remote by default but present locally in this workspace).

---

## Architecture & Request Lifecycle

1. Incoming HTTP request is received by Express and dispatched to a matching router in `src/routes`.
2. Route handlers call controllers in `src/controllers`, which validate request payloads and call model/service functions.
3. Services encapsulate business logic (authentication, user creation) and call model/data-layer functions.
4. Models in `src/models` execute SQL queries using the shared `pg` connection pool (`src/config/db.js`).
5. Authentication flow:
   - `POST /api/auth/login` — validates credentials via `auth.service.login`, which checks password with `bcryptjs`, issues an access token (JWT signed with `JWT_SECRET`) and a refresh token (signed with `REFRESH_TOKEN_SECRET`). The refresh token is set as an HTTP-only cookie and the access token is returned in JSON.
   - Protected routes require `Authorization: Bearer <accessToken>`; `auth.middleware` verifies the token and sets `req.user`.
   - `POST /api/auth/refresh` expects the refresh cookie and returns a new access token if valid.
6. Error handling: Controllers return status codes (400, 401, 404, 500) with JSON `{ message: '...'};` startup failures cause the process to exit with code 1.

---

## API Overview

All endpoints are prefixed with `/api` when mounted. The server exposes the following routes (as implemented in code):

### Authentication

- POST `/api/auth/register`
  - Purpose: Register a new user and immediately log them in.
  - Auth: No
  - Body (JSON): `{ "email": string, "name": string, "password": string }` (all required)
  - Response: 201 `{ message: 'User registered successfully', user, accessToken }`
  - Errors: 400 for validation or other registration errors.

- POST `/api/auth/login`
  - Purpose: Authenticate user and issue tokens.
  - Auth: No
  - Body: `{ "email": string, "password": string }`
  - Response: 200 `{ accessToken, user }` and sets `refreshToken` as an HTTP-only cookie.
  - Errors: 400/401 on invalid credentials or validation issues.

- POST `/api/auth/refresh`
  - Purpose: Exchange refresh cookie for a new access token.
  - Auth: No (uses cookie)
  - Body: none
  - Response: 200 `{ accessToken }`
  - Errors: 401 when refresh token missing/invalid.

- POST `/api/auth/logout`
  - Purpose: Clear refresh token cookie.
  - Auth: No (clears cookie)
  - Response: 200 `{ message: 'Logged out successfully' }`

- GET `/api/auth/me`
  - Purpose: Return current authenticated user.
  - Auth: Yes (Authorization header required)
  - Response: 200 `{ user }`
  - Errors: 401 if token missing/invalid.

### Customers / Contact Form

- POST `/api/customersdata` (also mounted at `/api/customers` POST)
  - Purpose: Public contact form — create a new customer / lead entry.
  - Auth: No
  - Body: `{ name, company, email, phone, source, status?, notes? }` (name, company, email, phone, source required)
  - Response: 201 `{ message: 'Customer submitted successfully', customer }`
  - Errors: 400 for validation; 500 on server error.

- GET `/api/customers`
  - Purpose: List all customers (ordered by newest)
  - Auth: Yes
  - Query params: none
  - Response: 200 `Array<Customer>`

- PUT `/api/customers/:id`
  - Purpose: Update a customer by `id`.
  - Auth: Yes
  - Path: `:id` (UUID)
  - Body: `{ name, company, email, phone, source, status, notes }` (required fields validated)
  - Response: 200 `{ message: 'Customer updated successfully', customer }` or 404 if not found.

- DELETE `/api/customers/:id`
  - Purpose: Delete a customer by `id`.
  - Auth: Yes
  - Response: 200 `{ message: 'Customer deleted successfully' }` or 404 if not found.

### Dashboard

- GET `/api/dashboard/summary`
  - Purpose: Returns aggregated counts for leads by status.
  - Auth: Yes
  - Response: 200 `{ totalLeads: number, new: number, contacted: number, qualified: number, won: number, lost: number }`

---

## Authentication Details

- Access tokens:
  - Algorithm: `jsonwebtoken.sign` with `JWT_SECRET` (HS256 default).
  - Payload includes `sub` (user id), `email`, and `role`.
  - Expiry: configured by `JWT_EXPIRES_IN` (default `1h`).
- Refresh tokens:
  - Signed with `REFRESH_TOKEN_SECRET` and returned in an HTTP-only cookie named `refreshToken`.
  - Expiry: configured by `REFRESH_TOKEN_EXPIRY` (default `7d`).
- Protected routes require an `Authorization: Bearer <accessToken>` header. The middleware verifies the token and loads the user from the database, attaching a safe user object to `req.user`.

---

## Database

- Engine: PostgreSQL (driver: `pg`).
- Connection: configured via environment variables (see below). `src/config/db.js` creates a `pg.Pool` using those values.
- Schema (created automatically at startup by `initDB`):
  - `users` table: `id (UUID PK)`, `email (unique)`, `name`, `role`, `passwordHash`, `createdAt`.
  - `customers` table: `id (UUID PK)`, `name`, `company`, `email`, `phone`, `source`, `status`, `notes`, `created_at`.
- Database creation: `src/config/ensureDatabase.js` connects to the server's default `postgres` database and creates the configured DB if it does not exist. The name is validated for safety before creation.


---

## Environment Variables

The server loads configuration from `.env` (see `src/config/config.js`). Below are the environment variables used by the codebase.

| Variable | Required | Default | Description |
|---|---:|---|---|
| `PORT` | No | `5000` | HTTP port for the server to listen on.
| `JWT_SECRET` | Yes | *none* | Secret used to sign access JWTs. **Required in production.**
| `JWT_EXPIRES_IN` | No | `1h` | Access token expiry (e.g. `1h`, `15m`).
| `REFRESH_TOKEN_SECRET` | No | `fallback_refresh_secret` | Secret used to sign refresh tokens. Override in production.
| `REFRESH_TOKEN_EXPIRY` | No | `7d` | Refresh token expiry duration.
| `DB_HOST` | No | `localhost` | PostgreSQL host.
| `DB_PORT` | No | `5432` | PostgreSQL port.
| `DB_USER` | No | `postgres` | PostgreSQL username used for connections.
| `DB_PASSWORD` | No | `postgres` | PostgreSQL password used for connections.
| `DB_NAME` | No | `democrm` | Target database name the app will create/use.

Notes:
- Do not commit real secrets. Replace `JWT_SECRET` and `REFRESH_TOKEN_SECRET` in production with strong secrets.
- A `.env` file is present in this workspace for local development; remove or secure it before publishing.

---

## Installation

### Prerequisites
- Node.js (12+ recommended — project uses CommonJS; verify with your environment)
- npm (or compatible package manager)
- PostgreSQL (or use Docker Compose to run one)
- Docker & Docker Compose (optional, recommended for streamlined local setup)

### Install dependencies

    cd server
    npm install

### Start (development)

    npm run dev

This runs `nodemon src/index.js`.

### Start (production)

    npm start




