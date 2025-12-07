# Retail Sales Management System

## 1. Overview

A high-performance full-stack application designed to manage and query millions of retail sales records efficiently. The system implements a normalized database architecture with a hybrid hosting strategy (AWS EC2 + Neon PostgreSQL) to optimize for read-heavy operations. It features a responsive UI with deep-linking capabilities, ensuring state persistence across searches and filters.

## 2. Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, TanStack Query (React Query).
- **Backend:** Node.js, Express.js, Zod (Validation).
- **Database:** PostgreSQL (Neon), Drizzle ORM.
- **Infrastructure:** AWS EC2 (Nginx Reverse Proxy), PM2.

## 3. Search Implementation Summary

Search is powered by a **GIN (Generalized Inverted Index)** using the `pg_trgm` extension on PostgreSQL. This allows for high-speed, case-insensitive fuzzy matching (e.g., `%query%`) on `Customer Name` and `Phone Number` fields, reducing query time from O(N) to near O(log N) compared to standard B-Tree scans. On the frontend, input is debounced (500ms) to minimize API load.

## 4. Filter Implementation Summary

Filtering utilizes a **Dynamic Query Builder** pattern within the service layer. The backend constructs a "Conditions Array" based on active parameters (Region, Gender, Date Range, etc.) and executes optimized SQL queries using Drizzle ORM.

- **Tags:** Handled via the `unnest` function to efficiently filter comma-separated string values.
- **State:** All filters are synchronized with the URL Query Parameters, serving as the single source of truth.

## 5. Sorting Implementation Summary

Sorting is implemented on the backend using dynamic `ORDER BY` clauses. Dedicated B-Tree indexes were created for `Date`, `Total Amount`, and `Quantity` to prevent expensive "File Sort" operations. The sort logic preserves all active filter states during execution.

## 6. Pagination Implementation Summary

Server-side pagination is implemented using the `LIMIT` and `OFFSET` SQL clauses. The API executes the main data query and the total count query in parallel (using `Promise.all`) to calculate `totalPages` and `hasNextPage` flags without blocking the event loop, ensuring sub-100ms response times for paginated results.

## 7. Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database (Local or Cloud URL)

### Backend Setup

1.  Navigate to the directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Configure Environment: Create a `.env` file and add your `DATABASE_URL`.
4.  Push Schema to DB: `npx drizzle-kit push`
5.  **Ingest Data:** Run the optimized seed script: `npx tsx scripts/seed.ts`
6.  Start Server: `npm run dev` (Runs on Port 3000)

### Frontend Setup

1.  Navigate to the directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start Development Server: `npm run dev`
4.  Configure Environment: Create a `.env` file and add your `VITE_API_BASE_URL`.
5.  Open `http://localhost:5173` in your browser.

**Live Link**: https://truestate.rohitt24k.dev
