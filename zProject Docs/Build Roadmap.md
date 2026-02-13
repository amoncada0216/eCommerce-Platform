# Ecommerce v1 — Production Build Roadmap (Updated)

## Phase 1 — Foundation (Infrastructure First)

- [x] Initialize monorepo (client + server folders)
- [x] Setup Express server
- [x] Connect PostgreSQL
- [x] Install & configure Prisma
- [x] Design initial schema (User + Product)
- [x] Run first migration
- [x] Seed basic admin user

**Goal:** Server runs, DB connected, schema stable

## Phase 2 — Authentication System

- [x] Implement password hashing (bcrypt)
- [x] Register endpoint
- [x] Login endpoint
- [x] JWT generation
- [x] Auth middleware (protect routes)
- [x] Role-based admin middleware
- [x] Test with Postman

**Goal:** Secure login + protected routes working

## Phase 3 — Product System

- [x] Admin: Create product
- [x] Admin: Update product
- [x] Public: List products (with pagination)
- [x] Public: Get single product
- [x] Add validation layer
- [ ] Admin: Bulk create products (JSON array input)
- [ ] Admin: Bulk update products
- [ ] Enforce atomic bulk operations (transaction-based)
- [ ] Slug uniqueness validation strategy
- [ ] Optional: CSV import pipeline (future enhancement)

**Goal:** Scalable product management with bulk operations

## Phase 4 — Cart System

- [x] Create Cart model
- [x] Create CartItem model
- [x] Add to cart
- [x] Increase cart item
- [x] Decrease cart item
- [x] Remove item
- [x] Get current cart
- [ ] Guest cart support (server-side, cookie-based)
- [ ] Merge guest cart into user cart on login

**Goal:** Persistent and scalable cart architecture

## Phase 5 — Order System (Critical Engineering Phase)

- [ ] Create Order model
- [ ] Create OrderItem model
- [ ] Implement checkout endpoint
- [ ] Validate stock
- [ ] Calculate total
- [ ] Use database transaction
- [ ] Reduce stock
- [ ] Clear cart after success
- [ ] Store shipping snapshot in order
- [ ] Prevent duplicate checkout submissions
- [ ] Order confirmation email (basic version)

**Goal:** Cart → Order conversion safely and atomically

## Phase 6 — Admin Order Management

- [ ] List all orders (admin)
- [ ] Filter orders (status, date, user)
- [ ] Update order status
- [ ] View order details
- [ ] Refund status handling (pre-Stripe logic)
- [ ] View users

**Goal:** Back-office system for operations control

## Phase 7 — Frontend Integration

- [ ] Axios setup
- [ ] Auth context
- [ ] Protected routes
- [ ] Product listing page
- [ ] Product detail page
- [ ] Cart page
- [ ] Checkout form
- [ ] Guest checkout support
- [ ] Admin dashboard pages
- [ ] Order tracking page (public view by order ID)
- [ ] Invite-to-register after guest checkout

**Goal:** Fully functional UI connected to API

## Phase 8 — Payments (Stripe)

- [ ] Create Stripe checkout session
- [ ] Handle webhook
- [ ] Verify payment signature
- [ ] Update order status to PAID
- [ ] Handle failed payments
- [ ] Idempotency handling for webhook events

**Goal:** Real money flow working safely

## Phase 9 — Communication & Retention Layer

- [ ] Order confirmation email
- [ ] Shipping notification email
- [ ] Password reset email
- [ ] Guest order tracking link
- [ ] Invite guest to create account (order history claim)

**Goal:** Lifecycle engagement & professional experience

## Phase 10 — Production Hardening

- [ ] Centralized error handling
- [ ] Input validation everywhere
- [ ] Rate limiting
- [ ] Secure HTTP headers
- [ ] Environment separation
- [ ] Logging (structured logs)
- [ ] Monitoring
- [ ] Deploy backend
- [ ] Deploy frontend

**Goal:** Production-ready system
