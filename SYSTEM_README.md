# VZZ Brokerage System README

## Overview

VZZ Brokerage is a real-estate brokerage platform for managing users, property listings, applications, transactions, commissions, and documents.
The repository contains a Spring Boot backend, a React frontend, and PostgreSQL for persistence.

This project is also branded in the codebase as HomeQuest, so you will see both names in the source and documentation.

## Business Goals

- Let sales agents publish and manage property listings.
- Let clients browse properties and submit applications or bids.
- Let property owners track their listings and outcomes.
- Let operations managers approve, supervise, and audit the brokerage workflow.
- Automatically calculate commissions when deals are completed.

## High-Level Architecture

The system follows a layered web application design:

1. The React frontend renders the user interface and calls backend APIs.
2. Spring Boot exposes REST endpoints and business services.
3. JPA repositories persist data to PostgreSQL.
4. Docker packages each major service for local development and deployment.

### Main Technology Stack

- Frontend: React, Vite, Redux Toolkit, React Router, Axios
- Backend: Java 21, Spring Boot, Spring Security, Spring Data JPA, Hibernate
- Database: PostgreSQL
- Packaging: Docker and Docker Compose
- Documentation: Markdown, Swagger/OpenAPI

## Core Domain Model

### User

Represents a person who can access the system.

Common fields include:

- First name
- Last name
- Email
- Password hash
- Role
- Status

### Agent

An agent manages listings and works deals for clients and owners.

Typical fields:

- License number
- Phone number
- Company affiliation
- Biography

### Client

A client searches for properties and submits bids or applications.

Typical fields:

- Phone number
- National ID
- Preferred area

### Owner

A property owner can list properties and review applications.

Typical fields:

- Phone number
- Identification number
- Owned properties

### Property

Represents a real-estate listing in the brokerage catalog.

Typical fields:

- Title
- Property type
- Price
- Location
- Status
- Assigned agent
- Owner

### Transaction

Represents the sale or transfer process after a bid is accepted.

Typical fields:

- Sale amount
- Status
- Completion date
- Property reference
- Participants

### Commission

Tracks how revenue is split between the brokerage and agents.

Typical fields:

- Commission rate
- Commission amount
- Commission type
- Linked transaction

### Document

Represents supporting files such as contracts or ownership records.

Typical fields:

- File name
- File type
- Storage URL
- Linked property or transaction

## Key Workflows

### 1. Registration and Login

1. A user registers with an email and password.
2. The backend validates the request and stores the account securely.
3. The user logs in and receives a JWT token.
4. The frontend sends the token with protected requests.

### 2. Property Listing Management

1. An agent or manager creates a property listing.
2. The listing is stored in the database.
3. The frontend shows the listing in public and role-specific views.
4. Authorized users can update or remove the listing.

### 3. Property Applications

1. A client or owner submits an application or bid.
2. The backend validates the request and stores the application.
3. The listing agent and owner review it.
4. The application is accepted, rejected, or withdrawn.

### 4. Transaction and Commission Tracking

1. When a bid is accepted, a transaction record is created.
2. The backend calculates the total commission.
3. The commission is split between company and agents.
4. Commission records are stored for reporting and dashboards.

### 5. Document Handling

1. A document is uploaded or linked to a property or transaction.
2. The system stores metadata and references.
3. Users can retrieve related documents when needed.

## Backend Structure

The backend is organized by responsibility:

- Controllers expose API endpoints.
- Services implement business rules.
- Repositories communicate with the database.
- DTOs carry request and response data.
- Entities map the persistent data model.
- Security components manage authentication and authorization.

### Important API Areas

- `auth` for registration and login
- `users` for agent, client, and owner profiles
- `properties` for listing management
- `applications` for bids and approvals
- `transactions` for sales and commission records
- `dashboard` for analytics and metrics
- `documents` for file-related operations

## Frontend Structure

The React frontend is responsible for:

- Rendering public property pages
- Handling login and registration forms
- Showing dashboards for different roles
- Managing client-side state
- Calling backend APIs
- Displaying validation and server errors

## Database Role

PostgreSQL stores:

- User accounts
- Profiles
- Properties
- Applications
- Transactions
- Commissions
- Documents

The database is the source of truth for brokerage records and reporting.

## Docker and Deployment

The project is designed to run as a containerized stack.

Typical services:

- Frontend container
- Backend container
- PostgreSQL container

Recommended local startup command:

```bash
docker compose up --build
```

## Environment Configuration

The backend normally depends on:

- Database URL
- Database username
- Database password
- JWT secret
- JWT expiration

The frontend commonly depends on:

- API base URL

## Security Model

The application uses token-based authentication with role-based access control.

Important roles include:

- Sales Agent
- Operations Manager
- Client
- Property Owner

Security principles used in the system:

- Passwords are stored as hashes
- Protected endpoints require JWT authentication
- Role checks restrict sensitive actions
- Managers can approve and oversee workflows

## Commission Logic

Commission is derived from the final sale or transaction amount.

The backend should:

1. Determine the total commission from the sale amount and configured rate.
2. Split the commission according to brokerage rules.
3. Store each commission record with the related transaction.

## Reporting and Dashboards

The platform is expected to support:

- Active listings
- Sold listings
- Pending applications
- Commission summaries
- Sales trends
- Agent performance

## Documentation Map

- Root `README.md`: UML and diagram overview
- Root `SYSTEM_README.md`: full system overview
- `backend/README.md`: backend-specific setup and endpoints
- `frontend/README.md`: frontend-specific setup
- `docs/phase-2-4-report.md`: prototype, Docker, version control, and testing report

## Suggested Next Enhancements

- Add an ER diagram for the database schema.
- Add API request and response examples for the main flows.
- Add screenshots of the frontend roles and dashboards.
- Add deployment notes for production environments.
