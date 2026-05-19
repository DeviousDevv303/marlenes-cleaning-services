# Marlene's Cleaning Services — Project TODO

## Database & Backend
- [x] Add `scheduling_requests` table to drizzle schema
- [x] Add `reviews` table to drizzle schema (with status: pending/approved/rejected)
- [x] Generate and apply DB migrations
- [x] tRPC router: submitSchedulingRequest (public, stores to DB + notifies owner)
- [x] tRPC router: getApprovedReviews (public, returns approved reviews)
- [x] tRPC router: submitReview (public, stores as pending)
- [x] tRPC router: admin.listPendingReviews (protected, owner only)
- [x] tRPC router: admin.moderateReview (protected, approve/reject)

## Frontend — Global
- [x] Dark premium theme (black bg, teal glow accents) in index.css
- [x] Google Fonts: Playfair Display + Inter
- [x] Responsive top navigation with brand name and anchor links
- [x] Mobile hamburger menu

## Frontend — Hero Section
- [x] Brand name "Down N' Dirty Cleaning Services"
- [x] Headline "WE CLEAN. YOU RELAX."
- [x] Subheading "Spotless spaces. Peace of mind."
- [x] "Schedule Cleaning" CTA button (scrolls to scheduling form)
- [x] "Call Now" CTA button (tel:580-461-5110)

## Frontend — Services Section
- [x] Six service cards: Deep Clean, Move In/Out, Home Clean, Office/Business, Post Construction, Rental Turnover
- [x] Each card: icon, short description, "from $150"

## Frontend — Scheduling Form
- [x] Fields: Name, Phone, Service Type (dropdown), Preferred Date, Address, Notes
- [x] Submit to tRPC → DB + owner notification
- [x] Success/error feedback to user

## Frontend — Payment CTA Section
- [x] Placeholder buttons: Cash App, PayPal, Stripe, Square (showing "Coming soon")
- [x] URLs read from environment variables only (no hardcoded credentials)

## Frontend — Reviews Section
- [x] Display approved reviews with star ratings
- [x] Submit-a-review form (name, rating, message) → pending moderation

## Frontend — Admin Panel
- [x] Owner-only route (/admin) protected by auth
- [x] List pending reviews
- [x] Approve / Reject buttons per review

## Environment Variables
- [ ] VITE_CASHAPP_URL — deferred, placeholder shown
- [ ] VITE_PAYPAL_URL — deferred, placeholder shown
- [ ] VITE_STRIPE_URL — deferred, placeholder shown
- [ ] VITE_SQUARE_URL — deferred, placeholder shown

## Quality
- [x] Vitest tests for scheduling and review routers (10/10 passing)
- [x] pnpm run build passes with zero errors
- [ ] Mobile layout verified by user

## Integration & Deployment (Phase 2)
- [x] Fix all TypeScript/build errors
- [x] Vitest: scheduling.submit router test
- [x] Vitest: reviews.submit and reviews.moderate router tests
- [x] Wire payment provider env vars — placeholders only, links deferred
- [x] Confirm owner notification fires on scheduling submit
- [x] Run pnpm build with zero errors
- [x] Save checkpoint — version 354d00d2
