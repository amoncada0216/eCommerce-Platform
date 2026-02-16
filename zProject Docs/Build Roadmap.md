# Ecommerce v1 — Production Build Roadmap (Updated)

---

## Phase 0 — Brand & Visual Identity (Store Design Layer)

### Brand Identity

- [ ] Define store name & positioning
- [ ] Define brand personality (luxury / minimal / sporty / etc.)
- [ ] Create logo (AI-assisted)
- [ ] Create logo variations (dark / light / icon-only)
- [ ] Define brand tagline
- [ ] Favicon generation

### Design System

- [ ] Define color palette (primary / secondary / accent)
- [ ] Define typography system (headings / body / UI text)
- [ ] Define spacing scale
- [ ] Define border radius style
- [ ] Define button variants (primary / secondary / danger)
- [ ] Define shadow system
- [ ] Define consistent UI states (hover / active / disabled)

### Product Image Strategy

- [ ] Create placeholder product images (AI-generated or static)
- [ ] Define consistent image background style
- [ ] Define product card layout
- [ ] Define image aspect ratio standard (1:1 recommended)
- [ ] Add fallback image for missing products
- [ ] Optimize images for performance

### UI Polish

- [ ] Navbar design
- [ ] Footer design
- [ ] Cart badge styling
- [ ] Loading skeleton components
- [ ] Empty state illustrations
- [ ] Error state UI
- [ ] Success confirmation design

### Marketing Presence (Optional but Strong)

- [ ] Landing page hero section
- [ ] Feature highlights section
- [ ] Trust indicators (secure payment badges)
- [ ] About page
- [ ] Contact page
- [ ] SEO metadata strategy

**Goal:**  
Create a cohesive, professional brand identity and polished UI that elevates the technical backend into a complete product experience.

---

## Phase 1 — Foundation (Infrastructure First)

### Project Setup

- [x] Initialize monorepo (client + server folders)
- [x] Setup Express server
- [x] Connect PostgreSQL
- [x] Install & configure Prisma
- [x] Design initial schema (User + Product)
- [x] Run first migration
- [x] Seed basic admin user

### TypeScript & Code Structure

- [x] Strict TypeScript configuration
- [x] Clean folder structure (controllers, routes, services, utils)
- [x] Path aliases configuration
- [x] Environment variable typing
- [x] ESLint + Prettier setup
- [x] Consistent naming conventions

### Database Foundation

- [x] Add database indexes where appropriate
- [x] Add unique constraints intentionally
- [x] Define cascading delete behavior explicitly
- [x] Add createdAt / updatedAt consistently
- [x] Define enum types early (roles, statuses)
- [x] Review schema normalization

### Configuration & Environment

- [x] Environment variable validation (Zod schema for process.env)
- [x] Separate dev / test / prod configs
- [x] Secure JWT secret handling
- [x] Define base URL constants
- [x] Add .env.example file

### Developer Experience

- [x] NPM scripts (dev, build, start, lint)
- [x] Hot reload (tsx / nodemon)
- [x] Prisma Studio access (dev only)
- [x] Clear README setup instructions
- [x] Git ignore hygiene

### Testing Foundation (Optional but Strong)

- [ ] Setup testing framework (Vitest / Jest)
- [ ] Basic health test
- [ ] Basic auth test

**Goal:**  
Stable, typed, validated, and scalable infrastructure ready for feature development.

---

## Phase 2 — Authentication System

### Core Authentication

- [x] Password hashing (bcrypt)
- [x] Register endpoint
- [x] Login endpoint
- [x] JWT generation
- [x] HTTP-only cookie storage
- [x] Auth middleware (protect routes)
- [x] Role-based admin middleware

### Security Hardening

- [x] Token expiration strategy
- [x] tokenVersion for global session invalidation
- [x] Logout endpoint (clear cookie)
- [x] Logout-all-sessions support
- [x] Prevent user enumeration on login
- [x] 401 vs 403 semantic correctness
- [x] Rate limit login endpoint
- [x] Brute-force protection (basic lockout logic)
- [x] Secure cookie flags (secure, sameSite=strict in prod)
- [x] Strong password policy enforcement

### Password Lifecycle

- [ ] Change password endpoint
- [ ] Verify current password before change
- [ ] Increment tokenVersion on password change
- [ ] Forgot password flow
- [ ] Password reset token (expiring, one-time use)
- [ ] Invalidate reset token after use

### Email Verification (Strong Signal)

- [ ] Email verification token
- [ ] Verification endpoint
- [ ] Prevent login if email not verified (optional)
- [ ] Resend verification email

### Token & Session Strategy

- [ ] Decide: short-lived JWT vs long-lived
- [ ] Refresh token strategy (optional advanced)
- [ ] Rotation strategy (advanced)
- [ ] Detect revoked users (DB check in middleware)

### Account Management

- [ ] Update profile endpoint
- [ ] Disable account (soft delete)
- [ ] Reactivate account flow
- [ ] User role upgrade/downgrade flow

### Testing & Validation

- [ ] Zod validation for all auth endpoints
- [ ] Integration tests for auth flows
- [ ] Test invalid token cases
- [ ] Test expired token behavior

**Goal:**  
Authentication system that is secure, lifecycle-aware, revocation-capable, and production-hardened.

---

## Phase 3 — Product System (Admin-Centric Design)

- [x] Admin: Create product (single)
- [x] Admin: Update product (single)
- [x] Public: List products (with pagination)
- [x] Public: Get single product
- [x] Add validation layer
- [x] Slug uniqueness validation strategy
- [ ] Admin: Bulk create products (JSON array input — primary method)
- [ ] Admin: Bulk update products (JSON array input)
- [ ] Enforce atomic bulk operations (transaction-based)
- [ ] Admin: CSV import endpoint
- [ ] CSV validation + transformation pipeline
- [ ] Slug conflict resolution in bulk operations
- [ ] Bulk stock adjustment endpoint

**Architecture Decision:**
All product creation (1 or 1000 items) must use the bulk endpoint internally.

**Goal:** Scalable, production-ready product management

---

## Phase 4 — Cart System

### Core Structure

- [x] Create Cart model
- [x] Create CartItem model
- [x] Add to cart
- [x] Increase cart item
- [x] Decrease cart item
- [x] Remove item
- [x] Get current cart

### Data Integrity

- [ ] Enforce unique (cartId, productId) constraint
- [ ] Validate product is active before adding
- [ ] Validate stock before increment
- [ ] Prevent quantity > available stock
- [ ] Prevent negative quantity
- [ ] Auto-delete cart item at quantity = 0

### Guest Cart Architecture

- [ ] Guest cart support (server-side, cookie-based)
- [ ] Generate secure guestId (UUID)
- [ ] Store guestId in HTTP-only cookie
- [ ] Attach cart to guestId if not authenticated
- [ ] Merge guest cart into user cart on login
- [ ] Resolve merge conflicts (sum quantities safely)
- [ ] Clear guest cart after merge

### Performance & UX

- [ ] Return cart totals (subtotal, item count)
- [ ] Return derived pricing fields (subtotal per item)
- [ ] Prevent stale cart at checkout
- [ ] Auto-remove inactive products from cart
- [ ] Auto-handle product price changes (optional notice)

### Advanced (Optional but Strong)

- [ ] Cart expiration policy (cleanup old guest carts)
- [ ] Inventory reservation system (advanced)
- [ ] Cart versioning to prevent race conditions
- [ ] Audit log for cart mutations (optional)

**Goal:**  
Persistent, race-condition-safe, stock-aware cart system ready for real checkout flow.

---

## Phase 5 — Order System (Critical Engineering Phase)

### Core Models

- [ ] Create Order model
- [ ] Create OrderItem model
- [ ] Create OrderStatus enum
- [ ] Add order status history tracking (timeline log)

### Checkout Flow

- [ ] Implement checkout endpoint
- [ ] Validate cart is not empty
- [ ] Validate stock for every item
- [ ] Re-fetch product price at checkout (no trusting client)
- [ ] Calculate total server-side
- [ ] Validate stock again inside transaction
- [ ] Use database transaction (atomic)
- [ ] Create Order
- [ ] Create OrderItems (with priceAtPurchase + name snapshot)
- [ ] Reduce product stock
- [ ] Clear cart after success

### Data Integrity

- [ ] Store shipping snapshot in order
- [ ] Store billing snapshot (if applicable)
- [ ] Store payment status field
- [ ] Prevent duplicate checkout submissions (idempotency key)
- [ ] Prevent checkout if order already created from cart
- [ ] Lock cart during transaction (optional advanced)

### Security & Edge Cases

- [ ] Ensure products are active before checkout
- [ ] Ensure quantity <= available stock
- [ ] Prevent negative stock
- [ ] Handle race conditions (concurrent checkouts)
- [ ] Graceful failure rollback

### Post-Checkout

- [ ] Return order summary response
- [ ] Order confirmation email (basic version)
- [ ] Generate public order tracking token
- [ ] Clear guest cart session (if guest checkout)

**Goal:**  
Cart → Order conversion that is atomic, race-condition safe, price-consistent, and production hardened.

---

## Phase 6 — Admin Dashboard & Order Management (Expanded)

### Backend

- [ ] List all orders (admin)
- [ ] Filter orders (status, date range, user, payment state)
- [ ] Search orders (by ID, email, name)
- [ ] Update order status
- [ ] Cancel order (admin-triggered)
- [ ] Partial cancel (remove specific order items)
- [ ] Refund order (manual pre-Stripe state)
- [ ] Issue partial refund (line-item based)
- [ ] Modify shipping information (before shipment)
- [ ] Resend order confirmation email
- [ ] Add internal admin notes to order
- [ ] View full order timeline (status history log)
- [ ] Lock order after shipment
- [ ] View user profile from order
- [ ] View product inventory
- [ ] Adjust inventory manually
- [ ] Bulk stock adjustment
- [ ] Low-stock alert system
- [ ] View sales analytics (daily / monthly totals)
- [ ] Revenue by product
- [ ] Revenue by date range
- [ ] Top-selling products
- [ ] Abandoned cart insights (future)
- [ ] Export orders (CSV)
- [ ] Export products (CSV)

---

### Frontend (Admin Dashboard)

- [ ] Admin authentication guard
- [ ] Role-based admin UI
- [ ] Product management page (bulk-first UI)
- [ ] CSV upload interface
- [ ] Bulk edit grid interface
- [ ] Inventory management panel
- [ ] Order management dashboard
- [ ] Order detail page (with status timeline)
- [ ] Cancel order button (conditional)
- [ ] Refund button (conditional)
- [ ] Partial refund UI
- [ ] Modify shipping info UI
- [ ] Add internal notes section
- [ ] User management page
- [ ] Sales analytics dashboard
- [ ] Revenue charts (daily / monthly)
- [ ] Product performance metrics
- [ ] Export data buttons
- [ ] System alerts panel (low stock / failed payments)

---

### Advanced Operational Controls (Optional but Strong)

- [ ] Order status history tracking table
- [ ] Audit log (admin action tracking)
- [ ] Inventory change history log
- [ ] Manual order creation (admin-assisted orders)
- [ ] Create order for user (phone/email support)
- [ ] Mark order as paid manually
- [ ] Fraud flag on order
- [ ] Blacklist user
- [ ] Disable user account
- [ ] View login activity
- [ ] Role management (future multi-admin system)

---

## Phase 7 — Frontend Integration

---

## Phase 7A — Integration Harness (Engineering Mode)

**Purpose:**  
Create a functional frontend that acts as a testing surface for backend features.  
Focus on correctness, not visual polish.

### Core Infrastructure

- [ ] Axios instance with `withCredentials: true`
- [ ] Centralized API configuration
- [ ] Global API error interceptor
- [ ] Auth context (fetch current user on app load)
- [ ] Login page
- [ ] Logout flow
- [ ] Basic protected route wrapper
- [ ] Role-based route guard (admin pages)

---

### Product Testing Surface

- [ ] Product listing page (basic pagination)
- [ ] Product detail page
- [ ] Add to cart button
- [ ] Stock availability indicator
- [ ] Basic low-stock warning display

---

### Cart Testing Surface

- [ ] Cart page
- [ ] Increase quantity button
- [ ] Decrease quantity button
- [ ] Remove item button
- [ ] Cart subtotal calculation
- [ ] Total item count display
- [ ] Persistent cart badge in navbar

---

### Checkout Testing Surface

- [ ] Basic checkout form (shipping info only)
- [ ] Order summary preview
- [ ] Submit order button
- [ ] Duplicate submission prevention
- [ ] Success page
- [ ] Error handling display

---

**Goal:**  
Visually validate backend logic, stress-test cart and checkout behavior, and expose race-condition or state bugs early.

---

## Phase 7B — Customer Experience Layer (Polish Mode)

**Purpose:**  
Enhance usability, retention, and business credibility after core backend flows are stable.

---

### Product Experience Enhancements

- [ ] Product filtering (price, availability)
- [ ] Product search
- [ ] Related products section
- [ ] Improved stock messaging
- [ ] Product performance indicators

---

### Cart & Guest Experience

- [ ] Guest cart support
- [ ] Guest cart merge after login
- [ ] Auto-refresh cart totals
- [ ] Cart empty state UI

---

### Orders & Account

- [ ] User order history page
- [ ] View order details
- [ ] Order status timeline view
- [ ] Cancel order (if allowed)
- [ ] Track order page (public via order ID)
- [ ] Guest order tracking page
- [ ] Claim guest order after registration

---

### Support & Retention

- [ ] Contact support form
- [ ] Order-specific support request
- [ ] FAQ page
- [ ] Return/refund request flow (future)
- [ ] Email verification reminder
- [ ] Password reset flow UI
- [ ] Session expiration handling
- [ ] Success / error toast notifications

---

### UX Improvements

- [ ] Loading skeleton components
- [ ] Optimistic UI updates (cart)
- [ ] Mobile responsiveness
- [ ] Accessibility improvements
- [ ] Consistent design system application

**Goal:**  
Transform the integration harness into a polished, production-ready customer interface.

---

## Phase 8 — Payments (Stripe)

### Core Payment Flow

- [ ] Create Stripe checkout session
- [ ] Attach orderId to Stripe metadata
- [ ] Store Stripe session ID in Order
- [ ] Redirect to Stripe hosted checkout

### Webhook Handling

- [ ] Create webhook endpoint
- [ ] Verify Stripe signature
- [ ] Handle checkout.session.completed
- [ ] Handle payment_intent.succeeded
- [ ] Handle payment_intent.payment_failed
- [ ] Handle checkout.session.expired
- [ ] Log raw webhook payload
- [ ] Return 200 quickly (no long processing inside webhook)

### Order State Management

- [ ] Update order status to PAID
- [ ] Update order status to FAILED
- [ ] Update order status to EXPIRED
- [ ] Store paymentIntentId
- [ ] Store payment status
- [ ] Store paidAt timestamp

### Security & Integrity

- [ ] Idempotency handling for webhook events
- [ ] Prevent double-processing of same event
- [ ] Validate order exists before updating
- [ ] Ensure order total matches Stripe amount
- [ ] Ensure currency matches expected value
- [ ] Reject webhook if amount mismatch

### Failure & Recovery

- [ ] Handle failed payments gracefully
- [ ] Allow retry payment flow
- [ ] Prevent duplicate checkout sessions per order
- [ ] Expire pending orders after timeout
- [ ] Release stock if payment fails (if reserved earlier)

### Testing & Dev Setup

- [ ] Use Stripe test keys
- [ ] Use Stripe CLI for local webhook testing
- [ ] Test idempotency behavior
- [ ] Simulate failed payments
- [ ] Simulate expired sessions

**Goal:**  
Payment system that is idempotent, secure, race-condition safe, and production-ready.

---

## Phase 9 — Communication & Retention Layer

### Transactional Emails (Customer-Facing)

- [ ] Order confirmation email
- [ ] Payment received email
- [ ] Payment failed email
- [ ] Order cancelled email
- [ ] Order refunded email
- [ ] Shipping notification email
- [ ] Delivery confirmation email
- [ ] Password reset email
- [ ] Email verification email
- [ ] Account created email

### Guest & Retention Flows

- [ ] Guest order tracking link
- [ ] Invite guest to create account (claim order history)
- [ ] Post-purchase account creation prompt
- [ ] Abandoned cart email (future)
- [ ] Re-engagement email (future)

### Support & Operational Emails

- [ ] Support ticket confirmation email
- [ ] Admin notified of new support request
- [ ] Low stock admin alerts
- [ ] Out-of-stock admin alerts
- [ ] Failed payment alert (admin)
- [ ] Suspicious activity alert (optional)

### Infrastructure & Engineering

- [ ] Email service provider integration (Resend / SendGrid / SES)
- [ ] Email template system (HTML + dynamic variables)
- [ ] Centralized mail service utility
- [ ] Retry mechanism for failed email sends
- [ ] Queue-based email dispatch (future enhancement)
- [ ] Logging email delivery status
- [ ] Environment-based email suppression (dev mode)

### Security & Compliance

- [ ] Signed tracking links (JWT-based)
- [ ] Expiring guest tracking tokens
- [ ] Unsubscribe link (if marketing later added)
- [ ] Avoid leaking sensitive order details in email
- [ ] Rate-limit email sending endpoints

**Goal:**  
Reliable transactional communication layer that builds user trust, supports operations, and prepares the system for long-term growth.

---

## Phase 10 — Production Hardening

### Error Handling & Stability

- [ ] Centralized error handling middleware
- [ ] Consistent API error response format
- [ ] Custom error classes (AppError, ValidationError, AuthError)
- [ ] Async error boundary wrapper
- [ ] Graceful shutdown handling
- [ ] Process-level error handlers (uncaughtException, unhandledRejection)

### Security Hardening

- [ ] Input validation everywhere (Zod enforced)
- [ ] Rate limiting (global + auth endpoints)
- [ ] Secure HTTP headers (Helmet)
- [ ] CORS configuration (restricted origins)
- [ ] CSRF protection (if needed for cookies)
- [ ] Cookie security flags (httpOnly, sameSite, secure in prod)
- [ ] Prevent parameter pollution
- [ ] Sanitize request inputs
- [ ] Restrict request body size
- [ ] Protect against brute-force login attempts

### Environment & Configuration

- [ ] Environment separation (dev / test / prod)
- [ ] Strict environment variable validation
- [ ] Secrets management strategy
- [ ] Production database configuration
- [ ] Prisma production optimization
- [ ] Disable Prisma Studio in production

### Logging & Observability

- [ ] Structured logging (pino / winston)
- [ ] Log levels (info, warn, error)
- [ ] Request logging middleware
- [ ] Error logging with stack traces
- [ ] Correlation/request IDs
- [ ] Centralized log aggregation (future)

### Monitoring & Health

- [ ] Health check endpoint (/health)
- [ ] Uptime monitoring integration
- [ ] Error tracking (Sentry or similar)
- [ ] Performance monitoring
- [ ] Database connection monitoring

### Performance & Optimization

- [ ] Response compression
- [ ] Caching strategy (Redis, optional)
- [ ] Database indexing audit
- [ ] Pagination enforced everywhere
- [ ] N+1 query audit
- [ ] Query performance review

### Deployment & DevOps

- [ ] Production build script
- [ ] Environment-based config loading
- [ ] Dockerization (optional but strong signal)
- [ ] CI pipeline (lint + build + test)
- [ ] Migration strategy for production
- [ ] Automated deploy workflow
- [ ] HTTPS enforcement
- [ ] Domain + DNS configuration

### Data Safety

- [ ] Database backup strategy
- [ ] Migration rollback plan
- [ ] Seed safety for production
- [ ] Prevent destructive operations in prod

**Goal:**  
System that is secure, observable, resilient, scalable, and deployment-ready.

---
