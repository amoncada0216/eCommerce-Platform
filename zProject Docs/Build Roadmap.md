# Ecommerce v1 — Production Build Roadmap (Checklist)

---

## Phase 1 — Foundation (Infrastructure First)

- [x] Initialize monorepo (client + server folders)
- [x] Setup Express server
- [x] Connect PostgreSQL
- [x] Install & configure Prisma
- [x] Design initial schema (User + Product)
- [x] Run first migration
- [x] Seed basic admin user

**Goal:** Server runs, DB connected, schema stable

---

## Phase 2 — Authentication System

- [ ] Implement password hashing (bcrypt)
- [ ] Register endpoint
- [ ] Login endpoint
- [ ] JWT generation
- [ ] Auth middleware (protect routes)
- [ ] Role-based admin middleware
- [ ] Test with Postman

**Goal:** Secure login + protected routes working

---

## Phase 3 — Product System

- [ ] Admin: Create product
- [ ] Admin: Update product
- [ ] Admin: Delete product
- [ ] Public: List products
- [ ] Public: Get single product
- [ ] Add validation layer

**Goal:** Product CRUD fully functional

---

## Phase 4 — Cart System

- [ ] Create Cart model
- [ ] Create CartItem model
- [ ] Add to cart
- [ ] Update quantity
- [ ] Remove item
- [ ] Get current cart
- [ ] Attach cart to authenticated user

**Goal:** Persistent cart per user

---

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

**Goal:** Cart → Order conversion safely

---

## Phase 6 — Admin Order Management

- [ ] List all orders (admin)
- [ ] Update order status
- [ ] View order details
- [ ] View users

**Goal:** Basic back-office system

---

## Phase 7 — Frontend Integration

- [ ] Axios setup
- [ ] Auth context
- [ ] Protected routes
- [ ] Product listing page
- [ ] Product detail page
- [ ] Cart page
- [ ] Checkout form
- [ ] Admin dashboard pages

**Goal:** Fully functional UI connected to API

---

## Phase 8 — Payments (Stripe)

- [ ] Create Stripe checkout session
- [ ] Handle webhook
- [ ] Verify payment signature
- [ ] Update order status to PAID
- [ ] Handle failed payments

**Goal:** Real money flow working

---

## Phase 9 — Production Hardening

- [ ] Centralized error handling
- [ ] Input validation everywhere
- [ ] Rate limiting
- [ ] Secure HTTP headers
- [ ] Environment separation
- [ ] Logging
- [ ] Deploy backend
- [ ] Deploy frontend

**Goal:** Production-ready system
