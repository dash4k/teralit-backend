# Teralit Backend

REST API backend for **Teralit** — a health-focused application that lets users upload images for AI-powered classification and chat with an AI agent about their results.

Built with **Node.js**, **Express**, **PostgreSQL**, and **Redis**, with JWT-based authentication and Swagger API documentation.

---

## Features

- User registration, login, and JWT authentication (access + refresh tokens)
- Session management (create, list, update status/timestamp, delete)
- Image uploads per session
- AI classification results per session
- AI agent chat (Ollama-powered) within sessions
- Swagger UI for API exploration with auto-generated specs
- Database migrations via `node-pg-migrate`
- CORS support for cross-origin requests
- Email notifications via Resend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Database | PostgreSQL (`pg`) |
| Cache / Token Store | Redis |
| Auth | JWT (`jsonwebtoken`), bcrypt |
| Validation | Joi |
| File Upload | Multer |
| AI Model | Custom Model API + Ollama API |
| API Docs | Swagger (`swagger-ui-express`, `swagger-autogen`) |
| Email | Resend |
| Linting | ESLint |
| Dev Server | Nodemon |

---

## Prerequisites

- Node.js >= 18
- PostgreSQL
- Redis
- A running Model API service (for classifications)
- A running Ollama API service (for chat)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dash4k/teralit-backend.git
cd teralit-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `APP_URL` | Application URL |
| `PROTOCOL` | Server protocol (`http` or `https`) |
| `HOST` | Server host (e.g. `localhost`) |
| `PORT` | Server port (e.g. `3000`) |
| `PGUSER` | PostgreSQL username |
| `PGHOST` | PostgreSQL host |
| `PGPORT` | PostgreSQL port |
| `PGPASSWORD` | PostgreSQL password |
| `PGDATABASE` | PostgreSQL database name |
| `ACCESS_TOKEN_KEY` | Secret key for JWT access tokens |
| `REFRESH_TOKEN_KEY` | Secret key for JWT refresh tokens |
| `REDIS_HOST` | Redis host |
| `REDIS_KEY` | Redis secret key |
| `MODEL_PROTOCOL` | Classification model API protocol |
| `MODEL_HOST` | Classification model API host |
| `MODEL_PORT` | Classification model API port |
| `AGENT_PROTOCOL` | Ollama API protocol |
| `AGENT_HOST` | Ollama API host |
| `AGENT_PORT` | Ollama API port |
| `RESEND_API_KEY` | Resend API key for email notifications |

### 4. Run database migrations

```bash
npm run migrate
```

To reset and re-run all migrations:

```bash
npm run migrate:refresh
```

### 5. Start the development server

```bash
npm run start:dev
```

The server will start on `<PROTOCOL>://<HOST>:<PORT>`.

---

## API Documentation

After starting the server, Swagger UI is available at:

```
<PROTOCOL>://<HOST>:<PORT>/docs
```

### API Overview

| Tag | Endpoints |
|---|---|
| **Authentications** | `POST /register`, `POST /login`, `PUT /authentications`, `DELETE /authentications` |
| **Users** | `GET /profile`, `PUT /profile`, `DELETE /users` |
| **Sessions** | `POST /sessions`, `GET /sessions`, `GET /sessions/:id`, `DELETE /sessions/:id` |
| **Session Status** | `PUT /sessions/:id/status`, `PUT /sessions/:id/timestamp` |
| **Session Images** | `POST /sessions/:sessionId/images`, `GET /sessions/:sessionId/images` |
| **Classification Results** | `POST /sessions/:sessionId/classifications`, `GET /sessions/:sessionId/classifications` |
| **Messages** | `POST /sessions/:sessionId/messages`, `GET /sessions/:sessionId/messages` |

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

---

## Project Structure

```
teralit-backend/
├── migrations/           # node-pg-migrate migration files
├── src/
│   ├── server.js         # App entry point
│   ├── server/           # Express app initialization
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic and external API calls
│   ├── middlewares/      # Express middlewares (auth, error handling)
│   ├── security/         # Security utilities (JWT, encryption)
│   ├── cache/            # Redis cache utilities
│   ├── emails/           # Email templates and utilities
│   ├── exceptions/       # Custom error classes
│   └── utils/            # Helper functions and utilities
├── .env.example          # Environment variable template
├── swagger.config.json   # Swagger auto-generated specs
├── eslint.config.js      # ESLint configuration
├── package.json
├── package-lock.json
└── README.md
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run start` | Start server |
| `npm run start:dev` | Start server with hot reload (nodemon) |
| `npm run migrate` | Run pending database migrations |
| `npm run migrate:refresh` | Roll back all migrations and re-run |
| `npm run lint` | Lint and auto-fix code with ESLint |

---

## Development

### Code Linting

Run ESLint to check and fix code style:

```bash
npm run lint
```

### Database Migrations

To create a new migration, use `node-pg-migrate`:

```bash
node-pg-migrate create <migration_name>
```

---

## License

ISC
