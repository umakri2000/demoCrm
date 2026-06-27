#  CRM (demoCrmClient)

A lightweight CRM frontend built with React + Vite and Tailwind CSS. Implements authentication, a dashboard, customer management (CRUD), and a contact form that integrates with a backend API.

---

## Features

- **Authentication**: Login, register and logout flows via `AuthContext` using the backend endpoints `/auth/login`, `/auth/register`, `/auth/logout` and a silent `/auth/refresh` on app load.
- **Dashboard**: Summary statistics fetched from `/dashboard/summary` and rendered as metric cards and a status breakdown.
- **Customer Management (CRUD)**:
  - List customers (`GET /customers`) — `CustomersPage`.
  - Edit customer (`PUT /customers/:id`) — `CustomerEditModal`.
  - Delete customer (`DELETE /customers/:id`) — `DeleteConfirmModal`.
- **Contact Form**: Public contact form that POSTs to `/customersdata` (`ContactUsPage`).
- **Forms & Validation**: Local form state with inline validation (no external form library used).
- **Client-side routing (view switching)**: Simple view switching implemented with component state in `App.tsx` (no `react-router`).
- **HTTP Client**: Centralized Axios instance with request/response interceptors and token handling.

---

## Tech Stack

- **Framework**: React (with Vite)
- **Language**: TypeScript (TSX files)
- **Styling**: Tailwind CSS
- **State Management**: React Context (`AuthContext`) + local `useState`/`useEffect`
- **Routing**: No router library; view selection via component state in `App.tsx`
- **HTTP Client**: Axios (`src/api/axiosInstance.ts`)
- **Form Libraries**: None (custom validation)
- **Validation**: Custom inline validators
- **UI / Icons**: `lucide-react` for icons
- **Build Tooling**: Vite, TypeScript

---

## Folder Structure

- **[index.html](index.html)**: App entry HTML used by Vite.
- **[vite.config.ts](vite.config.ts)**: Vite configuration.
- **[tailwind.config.js](tailwind.config.js)** / **[postcss.config.js](postcss.config.js)**: Tailwind/PostCSS setup.
- **[src/main.tsx](src/main.tsx)**: React entry — mounts `App` and imports global CSS.
- **[src/App.tsx](src/App.tsx)**: Top-level app. Wraps children in `AuthProvider` and switches views (login / signup / contact / authenticated views).
- **[src/context/AuthContext.tsx](src/context/AuthContext.tsx)**: Authentication provider, session refresh, login/register/logout helpers, and `useAuth` hook.
- **[src/api/axiosInstance.ts](src/api/axiosInstance.ts)**: Axios instance with baseURL, `withCredentials`, request interceptor (Authorization header) and response interceptor (handles 401 -> clears token and reloads).
- **[src/components/**]**: UI screens and components:
  - `LoginPage.tsx`, `SignUpPage.tsx`, `ContactUsPage.tsx` — public authentication and contact views.
  - `AuthenticatedLayout.tsx` — header/navigation and layout for authenticated area.
  - `Dashboard.tsx` — dashboard summary view.
  - `CustomersPage.tsx` — customer list (fetch, refresh, open edit/delete modals).
  - `CustomerEditModal.tsx`, `DeleteConfirmModal.tsx` — modal UI for editing and deleting customers.
- **[src/types/customer.ts](src/types/customer.ts)**: `Customer` TypeScript interface used across components.

---

## Getting Started

### Prerequisites
- Node.js: Not specified in `package.json` (use a recent LTS, e.g. Node 16+ or 18+).
- Package manager: `npm` (default) — project uses `package.json` scripts.

### Installation

Install dependencies from the `demoCrmClient` folder:

```bash
cd client/demoCrmClient
npm install
```

### Running the Project (Development)

```bash
npm run dev
```

This runs Vite in development mode and serves the app (default: http://localhost:5173).

### Build (Production)

```bash
npm run build
```

The `build` script runs `tsc -b` followed by `vite build` (see `package.json`).

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally using Vite's preview server.

---

## Environment Variables

- No `.env` or environment variable usage found in the client codebase.
- The Axios base URL is hard-coded in `src/api/axiosInstance.ts` as `http://localhost:5000/api`.

If you prefer environment-driven configuration, consider replacing the hard-coded `baseURL` with `import.meta.env.VITE_API_URL` and adding a `.env` with `VITE_API_URL`.

---

## Available Scripts

The following scripts are defined in [package.json](package.json):

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start Vite development server.
| `build` | `tsc -b && vite build` | Type-check / build TypeScript project then build production assets with Vite.
| `lint` | `oxlint` | Runs `oxlint` (project linter) — configured as a dev dependency.
| `preview` | `vite preview` | Preview a production build locally.

---

## Project Architecture

- **Component organization**: Presentational and page components are colocated in `src/components`. Modals are separate components reused inside pages.
- **API layer**: `src/api/axiosInstance.ts` centralizes base URL, headers, credentials, and interceptors.
- **Custom hooks / Context**: `AuthContext` exposes `login`, `register`, `logout`, `user`, `isAuthenticated`, and `isLoading`. There are no other custom hooks found.
- **Routing**: The app uses internal state in `App.tsx` to switch between public views and authenticated views — no `react-router`.
- **State flow**: Authentication state is held in `AuthContext`; other state is local to components (e.g., `CustomersPage` holds the customers array and modal visibility).
- **Utilities**: Minimal utility code; validation is implemented inline inside components.

---

## API Integration

- **API client**: `src/api/axiosInstance.ts` creates a single Axios instance with:
  - `baseURL: 'http://localhost:5000/api'` (hard-coded)
  - `withCredentials: true`
  - `Content-Type: application/json`
- **Request interceptor**: Adds `Authorization: Bearer <token>` header when `memoryToken` is set via `setAuthToken` (used by `AuthContext`).
- **Response interceptor**: On 401 responses (except auth endpoints), clears the token and forces a page reload or redirect to reset state.
- **Authentication flow**:
  - On app load `AuthProvider` calls `POST /auth/refresh` to attempt a silent refresh. If an `accessToken` is returned, `setAuthToken` is called and `/auth/me` is fetched for user details.
  - `login` posts to `/auth/login` and expects `{ accessToken, user }`.
  - `register` posts to `/auth/register` and expects `{ accessToken, user }`.
  - `logout` posts to `/auth/logout` and clears local session state.
- **Error handling**: Components capture axios errors and display messages; `AuthContext` maps network errors and backend message payloads to user-facing strings.

---

## Authentication

- Implemented via `AuthContext` which:
  - Attempts token refresh on startup (`/auth/refresh`).
  - Stores current user in memory and sets the Authorization header using `setAuthToken` (module-level variable inside `axiosInstance`).
  - Exposes `login`, `register`, `logout`, `isAuthenticated`, and `isLoading`.
- Note: Tokens are stored in memory only (no localStorage usage seen). The server is expected to manage refresh tokens via cookies (client uses `withCredentials: true`).

---

## Styling

- Styling is implemented using Tailwind CSS. Global imports are in `src/index.css` (`@tailwind base; @tailwind components; @tailwind utilities;`).
- Responsive layout uses Tailwind utility classes; components include mobile/desktop UI variations (e.g., `AuthenticatedLayout` mobile menu).

---

## Best Practices Used

- Centralized API client with interceptors for token handling and global error behavior (`src/api/axiosInstance.ts`).
- `AuthContext` encapsulates authentication concerns and exposes a `useAuth` hook for components.
- TypeScript interfaces defined for domain types (`src/types/customer.ts`) improving type safety.
- Components are small and focused; modals are reusable.

---

## Future Improvements

- Extract environment configuration (API base URL) to `import.meta.env.VITE_API_URL` and add `.env` support.
- Persist authentication token more robustly (secure HttpOnly cookies or safe refresh flow) depending on backend behavior.
- Introduce routing with `react-router` for clearer URL-based navigation and deep-linking.
- Consolidate form validation using a library like `react-hook-form` + `zod` for cleaner validation and better UX.
- Add unit / integration tests (Jest + React Testing Library) and end-to-end tests.
- Add a centralized notification/toast system for consistent success/error feedback.

---
