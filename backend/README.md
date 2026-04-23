# HomeQuest Backend

Real estate management platform built with Spring Boot 4 (Java 21).

---

## Tech Stack

- Java 21
- Spring Boot 4.0.5
- Spring Security 7 (JWT stateless)
- Spring Data JPA + Hibernate 7
- PostgreSQL 17
- Lombok
- SpringDoc OpenAPI 3 (Swagger UI)
- Spring WebSocket (STOMP) — stubbed, ready to enable
- Maven (single-module multi-source layout)

---

## Project Structure

```
backend/
├── src/main/java/com/webtech/backend/   # Entry point + seeder + OpenAPI config
├── auth-service/                         # Authentication & JWT
├── user-service/                         # User profiles (Agent, Owner, Client, Company)
├── property-service/                     # Properties, Locations, Applications
├── transaction-service/                  # Transactions, Commissions, Dashboard
├── document-service/                     # Document management (skeleton)
├── api-gateway/                          # WebSocket / Notification (stubbed)
└── pom.xml                               # Single compiled module
```

All services compile into one Spring Boot application via `build-helper-maven-plugin`.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/homequest
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=yourpassword
JWT_SECRET=your-256-bit-secret-key-here
JWT_EXPIRATION_MS=86400000
```

---

## Running the App

```bash
mvnw spring-boot:run
```

App starts on `http://localhost:8080`. All API endpoints are prefixed with `/api/v1`.

---

## Database Setup

On first run, drop and recreate the schema to let Hibernate build all tables:

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Then restart — the `DataSeeder` auto-populates test data.

---

## Test Credentials (seeded on startup)

| Role           | Email                    | Password      |
|----------------|--------------------------|---------------|
| Company Admin  | admin@homequest.rw       | Admin@1234    |
| Manager        | manager@homequest.rw     | Manager@1234  |
| Agent (Alice)  | alice@homequest.rw       | Agent@1234    |
| Agent (Bob)    | bob@homequest.rw         | Agent@1234    |
| Owner          | owner@homequest.rw       | Owner@1234    |
| Client         | client@homequest.rw      | Client@1234   |

---

## API Documentation

Swagger UI: `http://localhost:8080/api/v1/swagger-ui/index.html`

API Docs JSON: `http://localhost:8080/api/v1/v3/api-docs`

Click **Authorize** and paste the JWT token from login.

---

## Authentication

### Register
```
POST /api/v1/auth/register
```
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@homequest.rw",
  "password": "Agent@1234",
  "role": "ROLE_AGENT",
  "licenseNumber": "LIC-001",
  "companyId": 1
}
```

Username is auto-generated as `johndoe` (firstName + lastName, lowercase).

### Login
```
POST /api/v1/auth/login
```
```json
{
  "email": "alice@homequest.rw",
  "password": "Agent@1234"
}
```

Returns a JWT token. Use as `Authorization: Bearer <token>` on all protected requests.

---

## Roles

| Role               | Access                                              |
|--------------------|-----------------------------------------------------|
| ROLE_SUPER_ADMIN   | Full system access                                  |
| ROLE_COMPANY_ADMIN | Manage agents, properties, transactions, dashboard  |
| ROLE_MANAGER       | Same as company admin                               |
| ROLE_AGENT         | Manage own listings, sales, commissions             |
| ROLE_OWNER         | View own properties and transactions                |
| ROLE_CLIENT        | Submit bids, view own purchases                     |

---

## Services & Endpoints

### Auth Service — `/api/v1/auth`
| Method | Path              | Role      | Description              |
|--------|-------------------|-----------|--------------------------|
| POST   | `/register`       | Public    | Register new user        |
| POST   | `/login`          | Public    | Login, returns JWT       |

### User Service — `/api/v1/agents`, `/api/v1/owners`, `/api/v1/clients`
| Method | Path                    | Role                        | Description               |
|--------|-------------------------|-----------------------------|---------------------------|
| POST   | `/agents/me`            | AGENT                       | Create agent profile      |
| GET    | `/agents/me`            | AGENT                       | Get my profile            |
| PUT    | `/agents/me`            | AGENT                       | Update my profile         |
| GET    | `/agents/{id}`          | COMPANY_ADMIN, MANAGER      | Get agent by ID           |
| GET    | `/agents?companyId=`    | COMPANY_ADMIN, MANAGER      | List agents by company    |
| PATCH  | `/agents/{id}/status`   | COMPANY_ADMIN, MANAGER      | Update agent status       |
| POST   | `/owners/me`            | OWNER                       | Create owner profile      |
| GET    | `/owners/me`            | OWNER                       | Get my owner profile      |
| POST   | `/clients/me`           | CLIENT                      | Create client profile     |
| GET    | `/clients/me`           | CLIENT                      | Get my client profile     |

### Property Service — `/api/v1/properties`
| Method | Path                        | Role                        | Description                  |
|--------|-----------------------------|-----------------------------|------------------------------|
| POST   | `/properties`               | AGENT, ADMIN, MANAGER       | Create listing               |
| GET    | `/properties`               | Public                      | List all properties          |
| GET    | `/properties/{id}`          | Public                      | Get property                 |
| GET    | `/properties/my/listings`   | AGENT                       | My listed properties         |
| GET    | `/properties/my/sales`      | AGENT                       | Properties I am selling      |
| GET    | `/properties/my/owned`      | OWNER                       | My owned properties          |
| GET    | `/properties/my/buying`     | CLIENT, OWNER               | Properties I am buying       |
| GET    | `/properties/company/{id}`  | ADMIN, MANAGER              | Company properties           |
| PUT    | `/properties/{id}`          | AGENT, ADMIN, MANAGER       | Update property              |
| PATCH  | `/properties/{id}/status`   | AGENT, ADMIN, MANAGER       | Update status                |
| PATCH  | `/properties/{id}/selling-agent` | ADMIN, MANAGER         | Assign selling agent         |
| PATCH  | `/properties/{id}/buyer`    | AGENT, ADMIN, MANAGER       | Assign buyer                 |
| DELETE | `/properties/{id}`          | ADMIN, MANAGER              | Delete property              |

### Location Service — `/api/v1/locations`
| Method | Path                    | Role          | Description                        |
|--------|-------------------------|---------------|------------------------------------|
| POST   | `/locations`            | ADMIN         | Create location node               |
| GET    | `/locations/tree`       | Public        | Full hierarchy tree                |
| GET    | `/locations/{code}`     | Public        | Location with children             |
| GET    | `/locations/{code}/children` | Public   | Direct children of a location      |
| GET    | `/locations/type/{type}` | Public       | All locations of a level           |

Location hierarchy: `COUNTRY → PROVINCE → DISTRICT → SECTOR → CELL → VILLAGE`

### Property Applications — `/api/v1/applications`
| Method | Path                          | Role                   | Description           |
|--------|-------------------------------|------------------------|-----------------------|
| POST   | `/applications`               | CLIENT, OWNER          | Submit a bid          |
| GET    | `/applications/my`            | CLIENT, OWNER          | My bids               |
| GET    | `/applications/{id}`          | Authenticated          | Get bid by ID         |
| GET    | `/applications/property/{id}` | AGENT, ADMIN, MANAGER  | Bids on a property    |
| PATCH  | `/applications/{id}/accept`   | AGENT, OWNER, ADMIN    | Accept bid            |
| PATCH  | `/applications/{id}/reject`   | AGENT, OWNER, ADMIN    | Reject bid            |
| PATCH  | `/applications/{id}/withdraw` | CLIENT, OWNER          | Withdraw bid          |

### Transaction Service — `/api/v1/transactions`
| Method | Path                          | Role                   | Description                    |
|--------|-------------------------------|------------------------|--------------------------------|
| POST   | `/transactions`               | AGENT, ADMIN, MANAGER  | Create transaction             |
| GET    | `/transactions/{id}`          | Authenticated          | Get transaction                |
| GET    | `/transactions/my/listings`   | AGENT                  | My listing transactions        |
| GET    | `/transactions/my/sales`      | AGENT                  | My sale transactions           |
| GET    | `/transactions/my/owner`      | OWNER                  | My transactions as seller      |
| GET    | `/transactions/my/purchases`  | CLIENT, OWNER          | My purchase transactions       |
| GET    | `/transactions/company/{id}`  | ADMIN, MANAGER         | Company transactions           |
| GET    | `/transactions/my/commissions`| AGENT                  | My commission records          |
| GET    | `/transactions/{id}/commissions` | ADMIN, MANAGER      | Transaction commissions        |
| PATCH  | `/transactions/{id}/status`   | ADMIN, MANAGER         | Update status                  |

### Dashboard — `/api/v1/dashboard`
| Method | Path                       | Role           | Description              |
|--------|----------------------------|----------------|--------------------------|
| GET    | `/dashboard/agent`         | AGENT          | Agent KPIs + charts      |
| GET    | `/dashboard/company/{id}`  | ADMIN, MANAGER | Company KPIs + charts    |

---

## Commission Logic

On every completed transaction:

```
totalCommission     = saleAmount × commissionRate
companyFee          = totalCommission × 10%
agentPool           = totalCommission - companyFee
listingAgent        = agentPool × 30%
sellingAgent        = agentPool × 70%
```

Three `Commission` records are created automatically per transaction.

---

## Property Application (Bid) Fields

| Field                | Required | Description                              |
|----------------------|----------|------------------------------------------|
| propertyId           | Yes      | Target property                          |
| buyerFullName        | Yes      | Legal name for contract                  |
| buyerNationalId      | Yes      | National ID or passport                  |
| buyerPhone           | Yes      | Contact number                           |
| offerAmount          | Yes      | Proposed purchase price                  |
| depositAmount        | Yes      | Earnest money / deposit                  |
| fundingSource        | Yes      | CASH, BANK_MORTGAGE, PAYMENT_PLAN        |
| proposedClosingDate  | Yes      | Target transfer date (future)            |
| offerExpirationDate  | Yes      | Offer auto-expires after this date       |
| specialConditions    | No       | e.g. "Including furniture"               |

Expired bids are auto-cancelled daily at midnight via `@Scheduled`.

---

## Dashboard Metrics

### Agent Portal
- Total listings, active listings, sold listings
- Total sales closed, total listings transacted
- Total commission earned (selling + listing)
- Pending applications on my listings
- Listings by status (pie chart data)
- Monthly commission trend — last 12 months (line chart data)

### Company Portal
- Total revenue, total commission, company commission earned
- Total properties by status/type/city (chart data)
- Monthly sales trend — last 12 months (line chart data)
- Top agents leaderboard by commission
- Pending applications count

---

## WebSocket (Stubbed — ready to enable)

When re-enabled, connects via:
```js
const socket = new SockJS('/ws?token=' + jwtToken);
```

Real-time events fired automatically:

| Trigger                  | Recipient        | Topic                          |
|--------------------------|------------------|--------------------------------|
| Bid submitted            | Listing agent    | `/topic/user/{agentPublicId}`  |
| Bid accepted             | Buyer            | `/topic/user/{buyerPublicId}`  |
| Bid rejected             | Buyer            | `/topic/user/{buyerPublicId}`  |
| Transaction completed    | Listing agent    | `/topic/user/{agentPublicId}`  |
| Transaction completed    | Selling agent    | `/topic/user/{agentPublicId}`  |
| Transaction completed    | Owner            | `/topic/user/{ownerPublicId}`  |
| Transaction completed    | Company          | `/topic/company/{companyId}`   |

---

## What's Next

- [ ] Re-enable WebSocket / real-time notifications
- [ ] Fill document-service (upload, download, link to properties)
- [ ] Add pagination to list endpoints
- [ ] Add search/filter to property listings
- [ ] Write integration tests
- [ ] Add frontend portals (company + agent)
