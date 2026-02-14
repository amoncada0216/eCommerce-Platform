# 🛒 Ecommerce Platform v1

Production-grade ecommerce backend built with:

- **Node.js**
- **Express**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **JWT (HTTP-only cookies)**
- **Zod validation**

---

# 🏗 Architecture Overview

## 🧰 Tech Stack

- **Backend:** Express + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT stored in HTTP-only cookies
- **Validation:** Zod
- **Password Hashing:** bcrypt

---

# 🧠 Core Engineering Principles

- Database as the source of truth
- Stateless JWT with DB verification
- Global session invalidation via `tokenVersion`
- Atomic database transactions for critical flows
- Role-based access control
- Immutable order records
- Transaction-safe bulk operations
- Soft-delete strategy for registry data

---

# 🚀 Feature Phases

## ✅ Phase 1 — Foundation

- Express server setup
- PostgreSQL integration
- Prisma configuration
- Initial schema (User + Product)
- Migration system
- Seeded admin user

---

## 🔐 Phase 2 — Authentication

- Password hashing
- Register endpoint
- Login endpoint
- JWT generation
- Auth middleware
- Role-based admin middleware

---

## 📦 Phase 3 — Product System

- Admin: Create product
- Admin: Update product
- Public: List products (pagination)
- Public: Get single product
- Slug uniqueness strategy
- Bulk product creation (JSON array input)
- Bulk product updates
- CSV import (planned)
- Atomic bulk operations

---

## 🛒 Phase 4 — Cart System

- Persistent cart per user
- Add to cart
- Increase item
- Decrease item
- Remove item
- Get current cart
- Guest cart support (planned)

---

## 📑 Phase 5 — Order System

- Order model
- OrderItem model
- Checkout endpoint
- Stock validation
- Total calculation
- Database transaction
- Stock reduction
- Cart clearing
- Shipping snapshot storage

---

## 🛠 Phase 6 — Admin Dashboard

- Product bulk management
- CSV import interface
- Order management
- User management
- Inventory overview

---

## 💳 Phase 7 — Payments (Stripe)

- Stripe checkout session
- Webhook handling
- Payment verification
- Order status updates

---

## 🛡 Phase 8 — Production Hardening

- Centralized error handling
- Rate limiting
- Secure HTTP headers
- Structured logging
- Monitoring
- Deployment

---

# 📂 Project Structure

```
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
```

---

# 🧪 Local Development Setup

## 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd server
```

## 2️⃣ Install dependencies

```bash
npm install
```

## 3️⃣ Configure environment variables

Create a `.env` file in the root of the `server` directory.

Use `.env.example` as reference:

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:7777/ecommerce
JWT_SECRET=your_super_secret_key_here
BASE_URL=http://localhost:5000
```

## 4️⃣ Setup the database (Development Only)

```bash
npx prisma db push --force-reset
```

## 5️⃣ Seed the database

```bash
npm run seed
```

## 6️⃣ Start development server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

# 🧰 Useful Commands

```bash
npm run dev            # Start server with hot reload
npm run build          # Compile TypeScript
npm run start          # Run compiled production build
npm run typecheck      # TypeScript validation (no emit)
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run prisma:studio  # Open Prisma Studio (dev only)
npm run seed           # Seed database
```

---

# 📌 Current Status

Active development following a structured, production-grade engineering roadmap.

Focus: correctness, security, architecture clarity, and recruiter-grade implementation quality.
