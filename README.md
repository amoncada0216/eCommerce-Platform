# Ecommerce Platform v1

Production-grade ecommerce backend built with:

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT (HTTP-only cookies)
- Zod validation

---

## Architecture Overview

### Tech Stack

- Backend: Express + TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT stored in HTTP-only cookies
- Validation: Zod
- Password Hashing: bcrypt

---

## Core Principles

- Database as source of truth
- Stateless JWT with DB verification
- Global session invalidation via tokenVersion
- Atomic database transactions for critical flows
- Role-based access control
- Immutable order records
- Bulk operations are transaction-safe

---

## Feature Phases

### Phase 1 — Foundation

- Express server setup
- PostgreSQL integration
- Prisma configuration
- Initial schema (User + Product)
- Migration system
- Seed admin user

### Phase 2 — Authentication

- Password hashing
- Register endpoint
- Login endpoint
- JWT generation
- Auth middleware
- Role-based admin middleware

### Phase 3 — Product System

- Admin: Create product
- Admin: Update product
- Public: List products (pagination)
- Public: Get single product
- Slug uniqueness strategy
- Bulk product creation (JSON array input)
- Bulk product updates
- CSV import (planned)
- Atomic bulk operations

### Phase 4 — Cart System

- Persistent cart per user
- Add to cart
- Increase item
- Decrease item
- Remove item
- Get current cart
- Guest cart support (planned)

### Phase 5 — Order System

- Order model
- OrderItem model
- Checkout endpoint
- Stock validation
- Total calculation
- Database transaction
- Stock reduction
- Cart clearing
- Shipping snapshot storage

### Phase 6 — Admin Dashboard

- Product bulk management
- CSV import interface
- Order management
- User management
- Inventory overview

### Phase 7 — Payments (Stripe)

- Stripe checkout session
- Webhook handling
- Payment verification
- Order status updates

### Phase 8 — Production Hardening

- Centralized error handling
- Rate limiting
- Secure HTTP headers
- Logging
- Monitoring
- Deployment

---

## Project Structure

server/
src/
controllers/
routes/
middleware/
validators/
utils/
lib/
prisma/
schema.prisma
seed.ts

client/
frontend application

---

## Setup

Install dependencies:

npm install

Create `.env` file:

DATABASE_URL=your_database_url
JWT_SECRET=your_secret

Run migrations:

npx prisma migrate dev

Generate Prisma client:

npx prisma generate

Seed admin user:

npx tsx prisma/seed.ts

Start development server:

npm run dev

---

## Status

Active development following structured production roadmap.
