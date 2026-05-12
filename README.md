# HomeQuest

HomeQuest is a full-stack real estate brokerage management platform for VZZ Brokerage. It supports property listings, property applications, transactions, commissions, documents, dashboards, authentication, and role-based access control in a single system.

This repository is organized as a production-style monorepo with:

- a Spring Boot backend
- a React/Vite frontend
- Docker support for local deployment
- seeded demo data for fast evaluation
- a separate academic report in [`report.md`](/c:/Users/afany/Desktop/Projects/best-homequest/report.md)

## Product Summary

HomeQuest is designed to solve the operational problems that appear in a growing brokerage business:

- scattered data stored in spreadsheets, chats, or isolated tools
- poor visibility into property, application, and transaction status
- manual commission calculations and approval workflows
- difficulty enforcing role-specific access
- lack of a maintainable structure for future growth

The system centralizes brokerage activity into a structured web application so company staff can manage day-to-day operations more reliably.

## Key Capabilities

- user registration and login
- JWT-based authentication
- role-based access for admin, agent, owner, and client/customer users
- property listing management
- property search and detail viewing
- property application submission and review
- transaction creation and tracking
- automated commission calculation and payout splitting
- document handling modules
- dashboard summaries for business oversight
- live notification support through WebSocket infrastructure
- Docker-based deployment

## Technology Stack

### Backend

- Java 21
- Spring Boot 3.2.5
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL 17
- JJWT
- SpringDoc OpenAPI
- Spring WebSocket
- Lombok

### Frontend

- React 19
- Vite
- Redux Toolkit
- React Router
- Axios
- STOMP / SockJS
- React Toastify
- Tailwind CSS

### DevOps and Tooling

- Docker
- Docker Compose
- Maven

## Architecture

HomeQuest follows a layered architecture on the backend:

- **Controller layer** handles HTTP requests and responses
- **Service layer** contains business rules and transaction handling
- **Repository layer** handles persistence
- **Model layer** represents the business entities
- **DTO layer** transfers data safely between client and server

The frontend follows a role-oriented structure:

- public pages for marketing and property browsing
- authentication pages
- separate layouts for admin, agent, owner, and client areas
- reusable shared components for forms, tables, drawers, and navigation
- Redux slices for application state
- API helper modules for backend communication

## Domain Modules

The backend is organized by feature domain:

- `auth`
- `user`
- `property`
- `transaction`
- `document`
- `gateway`

This modular layout keeps the codebase maintainable and makes it easier to extend each business area independently.

## Main User Roles

- **ROLE_ADMIN**: full administrative oversight
- **ROLE_AGENT**: manage listings, applications, and commissions
- **ROLE_OWNER**: track owned properties and related activity
- **ROLE_CUSTOMER**: browse properties and submit applications

The frontend also refers to the customer role as a client in several screens and layouts.

## Core Workflows

### 1. Authentication

Users register and log in through JWT-secured endpoints. The frontend stores the token and attaches it to API requests automatically.

### 2. Property Management

Agents and administrators can create, edit, assign, and manage listings. Properties move through states such as available, under offer, and sold.

### 3. Property Applications

Clients and owners can submit applications for properties. Applications can be accepted, rejected, withdrawn, or expired.

### 4. Transaction and Commission Tracking

Accepted applications can create transactions. The transaction module calculates commissions and stores payout records for the company and agents.

### 5. Dashboards

Role-specific dashboards provide summaries and performance indicators for agents and company users.

## Repository Structure

```text
best-homequest/
|-- backend/
|-- frontend/
|-- docker-compose.yml
|-- report.md
|-- SYSTEM_README.md
`-- README.md
```

### Backend

The backend contains Spring Boot source code, configuration, and build files.

### Frontend

The frontend contains the React app, UI components, pages, hooks, store, and API wrappers.

### Documentation

- `README.md` = project documentation and setup guide
- `report.md` = academic final project report
- `SYSTEM_README.md` = implementation-oriented notes

## Configuration

### Backend Environment Variables

The backend reads configuration from environment variables or a local `.env` file.

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/homequest
SPRING_DATASOURCE_USERNAME=homequest
SPRING_DATASOURCE_PASSWORD=homequest123
JWT_SECRET=change-me-to-a-long-secret-key
JWT_EXPIRATION_MS=86400000
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:8080
```

If `VITE_API_URL` is not set, the frontend defaults to `http://localhost:8080/api/v1`.

## Local Development Setup

### Prerequisites

- Java 21
- Node.js 22 or newer
- Maven, or the included Maven wrapper
- PostgreSQL 17

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docker Setup

The repository includes a full Docker Compose stack:

- PostgreSQL database
- Spring Boot backend
- Nginx-served frontend build

### Start the Full Stack

```bash
docker compose up --build
```

### Default Ports

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

### Docker Notes

- the backend container reads database and JWT values from environment variables
- the frontend container is built with `VITE_API_URL=http://localhost:8080`
- the database uses a named volume for persistence

## API Documentation

The backend exposes OpenAPI documentation through SpringDoc.

- OpenAPI JSON: `http://localhost:8080/api/v1/v3/api-docs`
- Swagger UI: `http://localhost:8080/api/v1/swagger-ui.html`

If your local setup redirects Swagger differently, use the OpenAPI JSON endpoint and the configured UI route from `backend/src/main/resources/application.properties`.

## Key Backend Endpoints

### Authentication

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Properties

- `GET /api/v1/properties`
- `POST /api/v1/properties`
- `GET /api/v1/properties/{id}`
- `PUT /api/v1/properties/{id}`
- `PATCH /api/v1/properties/{id}/status`
- `DELETE /api/v1/properties/{id}`

### Property Applications

- `POST /api/v1/applications`
- `GET /api/v1/applications/my`
- `PATCH /api/v1/applications/{id}/accept`
- `PATCH /api/v1/applications/{id}/reject`
- `PATCH /api/v1/applications/{id}/withdraw`

### Transactions

- `POST /api/v1/transactions`
- `GET /api/v1/transactions/{id}`
- `PATCH /api/v1/transactions/{id}/status`

### Dashboards

- `GET /api/v1/dashboard/agent`
- `GET /api/v1/dashboard/company/{id}`

## Seeded Demo Accounts

The database seeder creates test users and sample records on startup.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@homequest.rw` | `Admin@1234` |
| Agent | `alice@homequest.rw` | `Agent@1234` |
| Agent | `bob@homequest.rw` | `Agent@1234` |
| Owner | `owner@homequest.rw` | `Owner@1234` |
| Client | `client@homequest.rw` | `Client@1234` |

## Testing and Validation

Recommended verification steps:

1. start PostgreSQL
2. run the backend
3. confirm Swagger UI loads
4. run the frontend
5. log in with a seeded account
6. verify role-based navigation
7. create and review a property application
8. run the application through Docker Compose

Sample high-priority checks:

- login succeeds and returns a token
- protected routes reject invalid or missing tokens
- property creation persists correctly
- application acceptance creates a transaction
- commissions are generated correctly
- dashboards load with data

## Development Notes

- The backend uses a repository pattern to isolate database logic from business logic.
- The frontend uses a centralized Axios client to attach JWT tokens and handle errors consistently.
- `PropertyApplicationService` contains the main application review flow and scheduled expiry logic.
- `DataSeeder` inserts demo data and is helpful for presentations and demonstrations.

## Troubleshooting

### Backend Fails to Start

- check that PostgreSQL is running
- verify `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`
- confirm Java 21 is installed

### Frontend Cannot Reach Backend

- confirm `VITE_API_URL`
- make sure the backend is running on port `8080`
- verify CORS or proxy settings if you change the default host

### Docker Compose Fails

- confirm Docker Desktop or the Docker Engine is running
- ensure ports `3000`, `5432`, and `8080` are free
- inspect container logs with `docker compose logs`

## Contributing

If you are extending the system:

1. keep new code aligned with the existing layered architecture
2. place business logic in services, not controllers
3. keep API contracts in DTOs
4. reuse the centralized frontend API client
5. avoid committing generated files or local environment files

## Related Documentation

- [report.md](/c:/Users/afany/Desktop/Projects/best-homequest/report.md)
- [SYSTEM_README.md](/c:/Users/afany/Desktop/Projects/best-homequest/SYSTEM_README.md)

## Status

The repository currently serves as a functional prototype with documentation, seeded data, Docker support, and a clear path for future production hardening.
