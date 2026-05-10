# HomeQuest Prototype, Docker, VCS, and Testing Report

## Project Overview

HomeQuest is a real-estate management platform built with a Spring Boot backend and a React/Vite frontend. The application supports authentication, user profile provisioning, property management, property applications, transactions, commissions, documents, live updates, and role-based access.

The current backend uses:

- Java 21
- Spring Boot
- Spring Security with JWT
- Spring Data JPA and Hibernate
- PostgreSQL
- Lombok
- SpringDoc OpenAPI

The frontend uses:

- React 19
- Vite
- Redux Toolkit
- React Router
- Axios
- STOMP/SockJS for live updates

## Phase 2. Software Development Prototype

### Prototype Summary

The prototype is an early but functional version of HomeQuest that validates the core business flow before full-scale expansion. It already demonstrates the main product ideas:

1. User registration and login with JWT security.
2. Automatic profile creation for role-based accounts.
3. Property listing creation, update, deletion, and search.
4. Property applications and bid management.
5. Transaction and commission tracking.
6. Document handling and dashboard summaries.
7. Notifications and live updates.

This prototype is structured to reduce risk by separating responsibilities into clear layers:

- Controllers expose HTTP endpoints.
- Services contain business logic.
- Repositories handle persistence.
- DTOs carry request and response data.
- Entities represent persisted domain objects.

### Best Practices Applied

The project already reflects good software engineering practices:

- Layered architecture for easier maintenance and testing.
- Use of DTOs so API contracts stay separate from database entities.
- Validation on request objects before data reaches business logic.
- Transaction boundaries on service methods that change data.
- Centralized exception handling.
- Secure password storage with hashing.
- Token-based authentication instead of session-based login.
- Consistent use of pagination for list endpoints.
- OpenAPI documentation for discoverability.

### Google Java Style Alignment

The backend follows the same principles encouraged by the Google Java Style Guide:

- Meaningful and consistent naming.
- Small, focused classes and methods.
- Clear package organization by feature.
- Avoidance of duplicated logic where services can centralize behavior.
- Prefer immutability or controlled mutation where possible.
- Use of standard formatting and readable control flow.

### Google JavaScript / React Style Alignment

The frontend follows modern React and JavaScript practices:

- Components are split by feature and responsibility.
- Reusable API client code is centralized.
- Redux state is organized in slices.
- Routing and access control are separated from view code.
- Environment variables are used for deployment-specific settings.
- Error handling is centralized in the HTTP client.

## Design Pattern Used

### Repository Pattern

The clearest design pattern used in HomeQuest is the Repository pattern. Spring Data JPA repositories abstract the persistence layer so services do not need direct SQL logic.

Examples in the codebase include:

- `PropertyRepository`
- `UserRepository`
- `AgentRepository`
- `ClientRepository`
- `OwnerRepository`
- `TransactionRepository`
- `CommissionRepository`

How it is used in the design:

1. Controllers call services.
2. Services call repositories.
3. Repositories provide CRUD and query methods.
4. The database access logic stays isolated from business logic.

Why this pattern is useful here:

- It keeps the code easier to test.
- It reduces duplication of database logic.
- It improves readability.
- It makes future database changes less disruptive.

In the property module, for example, `PropertyService` creates and updates business objects while `PropertyRepository` handles persistence and query execution.

## Phase 3. Dockerization

### Brief Process to Dockerize an Application

The typical Dockerization process is:

1. Identify the runtime required by the app.
2. Create a `Dockerfile` that installs the runtime and copies the application.
3. Add environment variables for configuration.
4. Expose the port used by the application.
5. If the app depends on other services, create a `docker-compose.yml` file.
6. Add `.dockerignore` files so the image stays small.
7. Build and run the containers.
8. Test the application inside containers.

### HomeQuest Docker Setup

The application has been containerized with:

- A backend Docker image based on Java 21
- A frontend Docker image based on Node build and Nginx runtime
- A PostgreSQL container for persistence
- A Compose file to run the full stack together

### How to Run

Build and start the stack:

```bash
docker compose up --build
```

Ports:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api/v1`

### Container Configuration Notes

- The backend reads database and JWT settings from environment variables.
- The frontend receives the API URL at build time through `VITE_API_URL`.
- PostgreSQL stores data in a named volume so the database survives container restarts.

## Phase 3. Version Control System Setup

### Important Note

The local environment used for verification does not have `svn` installed, so I could not run an actual SVN installation command here. However, the setup below shows how SVN should be configured for this application on a machine that has SVN available.

### SVN Setup Steps

1. Install SVN client and server tools on the development machine.
2. Create a local SVN repository.
3. Create the standard repository folders:
   - `trunk`
   - `branches`
   - `tags`
4. Check out `trunk` into the project workspace.
5. Copy the application source into the working copy.
6. Add ignore rules for build output, node modules, target directories, and local environment files.
7. Commit the initial project snapshot.
8. Continue committing changes in small logical increments.

### What Should Be Captured

The repository should include:

- Backend source code
- Frontend source code
- Configuration files
- Docker files
- Documentation
- Tests
- Dependency manifests

### Recommended Ignore Items

- `backend/target`
- `frontend/node_modules`
- `frontend/dist`
- `.env`
- IDE-specific files
- Temporary log files

## Phase 4. Software Test Plan

### Test Objective

The goal of testing is to verify that HomeQuest behaves correctly, remains secure, and supports the core real-estate workflows without breaking under normal use.

### Test Scope

The following areas should be tested:

- Authentication and authorization
- Registration and login
- Profile provisioning by role
- Property management
- Property applications and bid actions
- Transaction and commission flows
- Document handling
- Dashboard calculations
- API validation and error handling
- Frontend routing and form behavior

### Test Types

#### 1. Unit Testing

Validate individual service methods, helper methods, and utility logic in isolation.

Examples:

- Registering a new user
- Rejecting duplicate emails
- Mapping entities to response DTOs
- Updating property status

#### 2. Integration Testing

Validate multiple layers together, especially controller -> service -> repository flows.

Examples:

- `/auth/register`
- `/auth/login`
- `/properties`
- `/transactions`

#### 3. Security Testing

Verify role restrictions and JWT enforcement.

Examples:

- Public endpoints stay accessible without a token.
- Protected endpoints reject invalid tokens.
- Role-based endpoints block unauthorized access.

#### 4. API Testing

Use Swagger UI, Postman, or automated HTTP tests to confirm requests and responses follow the contract.

#### 5. Frontend Testing

Check routes, form validation, state updates, and API error handling in the browser.

#### 6. Docker/Environment Testing

Confirm the application starts correctly inside containers and connects to PostgreSQL.

### Sample Test Cases

| ID | Test Case | Expected Result |
|---|---|---|
| TC-01 | Register a valid new user | Account is created and JWT is returned |
| TC-02 | Register with an existing email | Request fails with a clear error |
| TC-03 | Login with valid credentials | JWT token is returned |
| TC-04 | Login with an invalid password | Authentication fails |
| TC-05 | Create a property as an authorized user | Property is saved successfully |
| TC-06 | Access a protected endpoint without a token | Request is rejected |
| TC-07 | Submit a property application | Application is stored successfully |
| TC-08 | Accept or reject an application | Status is updated correctly |
| TC-09 | Start the app with Docker Compose | Backend, frontend, and database start correctly |
| TC-10 | Reload the frontend after a route change | SPA routing still works |

### Exit Criteria

The software can be considered ready for the next prototype stage when:

- Core flows pass their tests.
- Security rules work as expected.
- Dockerized deployment starts successfully.
- No critical defects remain open.
- Main API endpoints respond correctly.

## Verification Summary

The codebase already contains the building blocks required for the assignment:

- Spring Boot backend with layered architecture
- Repository-based persistence
- JWT authentication
- React frontend with structured state and routing
- Seed data and OpenAPI support

The new Docker setup and test plan complete the missing deployment and quality-assurance parts of the prototype deliverable.
