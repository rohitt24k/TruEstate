## 1\. Backend Architecture

The backend is built on a **Layered Architecture** pattern using **Node.js** and **Express**. It is designed to handle high-throughput read operations on a dataset of millions of records.

- **Runtime Environment:** Node.js with Express.js for non-blocking I/O handling.
- **Database Layer:** PostgreSQL (hosted on Neon) serving as the relational data store.
- **ORM Layer:** **Drizzle ORM** was selected over Prisma to minimize the memory footprint on the application server (EC2) and ensure near-native SQL performance.
- **Validation Layer:** **Zod** is implemented as a middleware layer to ensure strict type safety and request validation before data reaches the controllers.
- **Database Design:**
  - **Normalization:** The data follows a star-schema variant, separating `Customers` and `Products` into distinct tables to reduce data redundancy and improve cache efficiency.
  - **Indexing:** A hybrid indexing strategy is employed:
    - **GIN (Generalized Inverted Index):** Used with `pg_trgm` extension for high-performance, case-insensitive substring search on names and phones.
    - **B-Tree Indexes:** Applied to high-cardinality columns (Region, Date, Amount) for efficient filtering and sorting.

## 2\. Frontend Architecture

The frontend is a Single Page Application (SPA) built with **React** and **Vite**, prioritizing performance and deep-linking capabilities.

- **State Management Strategy:**
  - **Server State:** Managed via **React Query (TanStack Query)** to handle caching, background refetching, and deduping of network requests.
  - **Application State:** The **URL (Search Params)** serves as the "Single Source of Truth" for all filters and pagination. This ensures the application is shareable and retains context on refresh.
- **Component Architecture:** A modular, component-based structure separating "Smart Containers" (Pages) from "Dumb Components" (UI elements).
- **Build System:** Vite is used for optimized bundling and fast hot-module replacement (HMR).

## 3\. Data Flow

The data flow follows a strict unidirectional path from the Client to the Database and back:

1.  **Request Initiation:** User interacts with UI (e.g., searches "John"). The URL updates (`?search=John`).
2.  **Reverse Proxy:** Nginx (on EC2) receives the request and proxies API calls (`/api`) to the Node.js backend.
3.  **Validation Middleware:** The request enters the Express application. Zod schemas validate and sanitize input types (e.g., converting query strings to numbers/arrays).
4.  **Controller Layer:** Accepts the validated request and invokes the appropriate Service.
5.  **Service Layer:** Contains the core business logic. It dynamically constructs SQL queries based on the provided filters.
6.  **Data Access Layer (Drizzle):** The ORM translates the service logic into optimized SQL and executes it against PostgreSQL.
7.  **Database:** PostgreSQL uses the pre-configured GIN/B-Tree indexes to retrieve data efficiently.
8.  **Response:** Data is formatted and returned to the client as a JSON payload containing both the dataset and pagination metadata.

## 4\. Folder Structure

The project follows a monorepo-style structure separating concerns clearly.

```text
📁 root/
├── backend/
│   ├── src/
│   │   ├── Validators/    # Zod schemas for input validation
│   │   ├── controllers/   # Request handlers (Input/Output logic)
│   │   ├── db/            # Database configuration & Schema
│   │   ├── middlewares/   # Express middlewares (Zod validation, etc.)
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic & Query construction
│   │   ├── utils/         # Helper functions
│   │   └── index.ts       # Application entry point
│   │
│   ├── scripts/           # Data ingestion & seeding scripts
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/        # Static assets (images, fonts)
│   │   ├── components/    # Reusable UI components (Table, Search, Filters)
│   │   ├── hooks/         # Custom hooks (useSalesFilters, useDebounce)
│   │   ├── lib/           # CN classname utility
│   │   ├── pages/         # Main view controllers (SalesPage)
│   │   ├── routes/        # Frontend routing configuration
│   │   ├── services/      # Axios HTTP client configuration
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Frontend utility functions
│   │   ├── App.tsx        # Root component
│   │   └── main.tsx       # Entry point
│   │
│   └── package.json
│
└── docs/
    └── architecture.md    # System design documentation
```

## 5\. Module Responsibilities

### Backend Modules

- **Controllers:** Responsible for parsing HTTP requests, triggering services, and sending HTTP responses. They do not contain business logic.
- **Services:** The "Brain" of the backend. Responsible for logic such as dynamic filtering construction, sorting logic, and pagination math.
- **Validators:** Responsible for data integrity. Ensures incoming data matches the expected schema (types, formats, ranges) before processing.
- **Schema:** Defines the database structure, relationships between entities, and indexing rules.

### Frontend Modules

- **Pages:** Acts as the container for data fetching. It connects the URL state to the API service.
- **Hooks:** Encapsulates reusable logic. Specifically, converting URL parameters into typed filter objects and handling input debouncing.
- **Services (Frontend):** Handles the physical communication with the backend API (Axios instances, interceptors).
- **Components:** Pure presentation layers responsible only for rendering data passed via props.
