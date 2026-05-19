# Marlene's Cleaning Services — Project TODO

## Database & Backend
- [ ] Add `scheduling_requests` table to drizzle schema
- [ ] Add `reviews` table to drizzle schema (with status: pending/approved/rejected)
- [ ] Generate and apply DB migrations
- [ ] tRPC router: submitSchedulingRequest (public, stores to DB + notifies owner)
- [ ] tRPC router: getApprovedReviews (public, returns approved reviews)
- [ ] tRPC router: submitReview (public, stores as pending)
- [ ] tRPC router: admin.listPendingReviews (protected, owner only)
- [ ] tRPC router: admin.moderateReview (protected, approve/reject)

## Frontend — Global
- [ ] Dark premium theme (black bg, teal glow accents) in index.css
- [ ] Google Fonts: Playfair Display + Inter
- [ ] Responsive top navigation with brand name and anchor links
- [ ] Mobile hamburger menu

## Frontend — Hero Section
- [ ] Brand name "Down N' Dirty Cleaning Services"
- [ ] Headline "WE CLEAN. YOU RELAX."
- [ ] Subheading "Spotless spaces. Peace of mind."
- [ ] "Schedule Cleaning" CTA button (scrolls to scheduling form)
- [ ] "Call Now" CTA button (tel:580-461-5110)

## Frontend — Services Section
- [ ] Six service cards: Deep Clean, Move In/Out, Home Clean, Office/Business, Post Construction, Rental Turnover
- [ ] Each card: icon, short description, "from $150"

## Frontend — Scheduling Form
- [ ] Fields: Name, Phone, Service Type (dropdown), Preferred Date, Address, Notes
- [ ] Submit to tRPC → DB + owner notification
- [ ] Success/error feedback to user

## Frontend — Payment CTA Section
- [ ] Placeholder buttons: Cash App, PayPal, Stripe, Square
- [ ] URLs read from environment variables only (no hardcoded credentials)

## Frontend — Reviews Section
- [ ] Display approved reviews with star ratings
- [ ] Submit-a-review form (name, rating, message) → pending moderation

## Frontend — Admin Panel
- [ ] Owner-only route (/admin) protected by auth
- [ ] List pending reviews
- [ ] Approve / Reject buttons per review

## Environment Variables
- [ ] VITE_CASHAPP_URL
- [ ] VITE_PAYPAL_URL
- [ ] VITE_STRIPE_URL
- [ ] VITE_SQUARE_URL

## Quality
- [ ] Vitest tests for scheduling and review routers
- [ ] pnpm run build passes with zero errors
- [ ] Mobile layout verified

## Integration & Deployment (Phase 2)
- [x] Fix all TypeScript/build errors
- [x] Vitest: scheduling.submit router test
- [x] Vitest: reviews.submit and reviews.moderate router tests
- [x] Wire payment provider env vars (VITE_CASHAPP_URL, VITE_PAYPAL_URL, VITE_STRIPE_URL, VITE_SQUARE_URL) — placeholders only, links deferred
- [x] Confirm owner notification fires on scheduling submit
- [x] Run pnpm build with zero errors
- [x] Save checkpoint and publish
