# VZZ Brokerage UML Overview

This repository contains the HomeQuest prototype, adapted here as the VZZ Brokerage system documentation set.
The diagrams below capture the main actors, data model, workflows, and software components for the brokerage platform.

## 1. Use Case Diagram

Actors:

- Sales Agents
- Operations Managers
- Clients
- Property Owners

Main use cases:

- User registration and login
- Property listing management
- Submitting property applications
- Tracking commissions

```mermaid
flowchart LR
    SA[Sales Agents]
    OM[Operations Managers]
    C[Clients]
    PO[Property Owners]

    UC1((User registration / login))
    UC2((Property listing management))
    UC3((Submit property application))
    UC4((Track commissions))
    UC5((Approve / reject listings))
    UC6((Review applications))

    SA --> UC1
    SA --> UC2
    SA --> UC4
    OM --> UC1
    OM --> UC2
    OM --> UC5
    OM --> UC6
    C --> UC1
    C --> UC3
    C --> UC4
    PO --> UC1
    PO --> UC2
    PO --> UC3
    PO --> UC4
```

## 2. Class Diagram

Core entities:

- Property
- User
- Agent
- Client
- Owner

Supporting operations:

- Transaction
- Commission
- Document

```mermaid
classDiagram
    class User {
        +Long id
        +String firstName
        +String lastName
        +String email
        +String passwordHash
        +String role
        +boolean active
    }

    class Agent {
        +String licenseNumber
        +String phone
        +String companyName
        +String bio
    }

    class Client {
        +String phone
        +String nationalId
        +String preferredLocation
    }

    class Owner {
        +String phone
        +String idNumber
    }

    class Property {
        +Long id
        +String title
        +String propertyType
        +String status
        +double price
        +String location
    }

    class Transaction {
        +Long id
        +double saleAmount
        +String status
        +LocalDate completedAt
    }

    class Commission {
        +Long id
        +double rate
        +double amount
        +String commissionType
    }

    class Document {
        +Long id
        +String fileName
        +String fileType
        +String storageUrl
    }

    User <|-- Agent
    User <|-- Client
    User <|-- Owner

    Agent "1" --> "many" Property : manages
    Owner "1" --> "many" Property : owns
    Client "1" --> "many" Property : applies for

    Property "1" --> "many" Transaction : generates
    Transaction "1" --> "many" Commission : creates
    Property "1" --> "many" Document : has
    Transaction "1" --> "many" Document : attaches
```

## 3. Activity Diagram

This flow shows the internal working of the brokerage from bid submission to approval and commission calculation.

```mermaid
flowchart TD
    A([Start]) --> B[Client submits bid]
    B --> C{Bid valid?}
    C -- No --> D[Reject submission and show validation errors]
    D --> Z([End])
    C -- Yes --> E[Save property application]
    E --> F[Notify listing agent and owner]
    F --> G[Operations manager reviews bid]
    G --> H{Approved?}
    H -- No --> I[Mark bid rejected]
    I --> J[Notify client]
    J --> Z
    H -- Yes --> K[Mark bid accepted]
    K --> L[Create transaction record]
    L --> M[Calculate total commission]
    M --> N[Split commission between company and agents]
    N --> O[Store commission records]
    O --> P[Update property status to sold]
    P --> Q[Notify all stakeholders]
    Q --> Z([End])
```

## 4. Sequence Diagram

This sequence models property application submission.

```mermaid
sequenceDiagram
    actor Client
    participant UI as React Frontend
    participant PC as PropertyController
    participant PS as PropertyService
    participant PR as PropertyRepository
    participant DB as PostgreSQL

    Client->>UI: Fill application form and submit
    UI->>PC: POST /api/v1/applications
    PC->>PS: validateAndSubmit(applicationDto)
    PS->>PR: findPropertyById(propertyId)
    PR->>DB: SELECT property record
    DB-->>PR: property data
    PR-->>PS: property entity
    PS->>PR: save(application)
    PR->>DB: INSERT application record
    DB-->>PR: saved application
    PR-->>PS: application entity
    PS-->>PC: application response
    PC-->>UI: 201 Created + payload
    UI-->>Client: Show confirmation
```

## 5. Component Diagram

This diagram shows the major physical components and their dependencies.

```mermaid
flowchart LR
    subgraph Frontend["React Frontend"]
        FE1[Pages]
        FE2[Components]
        FE3[API Client]
    end

    subgraph Backend["Spring Boot Backend"]
        BE1[Controllers]
        BE2[Services]
        BE3[Repositories]
        BE4[Security / JWT]
    end

    DB[(PostgreSQL Database)]
    DC1[(Frontend Docker Container)]
    DC2[(Backend Docker Container)]
    DC3[(Database Docker Container)]

    FE3 --> BE1
    BE1 --> BE2
    BE2 --> BE3
    BE3 --> DB
    BE4 --> BE1

    DC1 -. packages .-> FE3
    DC2 -. packages .-> BE1
    DC3 -. persists .-> DB
```

## Notes

- The diagrams are written in Mermaid so they can be rendered directly in GitHub and many Markdown viewers.
- The terms VZZ Brokerage and HomeQuest refer to the same project structure in this repository.
- For implementation details, see the root-level `SYSTEM_README.md` and the module-specific READMEs in `backend/` and `frontend/`.
