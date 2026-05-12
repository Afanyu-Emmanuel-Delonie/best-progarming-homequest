# HomeQuest Frontend

React 19 + Vite frontend for the VZZ Brokerage / HomeQuest platform.

---

## Tech Stack

- React 19, Vite
- Redux Toolkit (state management)
- React Router (routing + guards)
- Axios (HTTP client)
- STOMP / SockJS (real-time updates — stubbed)

---

## Project Structure

```
frontend/src/
├── api/          # Axios client and endpoint functions
├── components/   # Shared UI components
├── context/      # React context providers
├── guards/       # Route access control
├── hooks/        # Custom hooks
├── layouts/      # Page layout wrappers
├── pages/        # Route-level page components
├── store/        # Redux slices
└── utils/        # Helper functions
```

---

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
```

**Environment** — create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

---

## Docker

```bash
docker compose up --build   # served via Nginx on http://localhost:3000
```

---

## Notes

- SPA routing is handled by Nginx (`nginx.conf`) and Vite's `vercel.json` / `public/_redirects`.
- API errors are handled centrally in the Axios client (`src/api/`).
- Role-based route guards live in `src/guards/`.
