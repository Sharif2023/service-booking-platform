# 🧪 Testing Guide - Service Booking Platform

Mark each step: ✅ Pass | ❌ Fail | ⏳ Pending

---

## Phase 1: Setup & Infrastructure

### 1.1 Backend Setup
- [ ] `cd backend && npm install` — no errors
- [ ] `.env` file configured with all values:
  - `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`
  - `JWT_SECRET`
  - `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET`
  - `EMAIL_USER=sharifislam0505@gmail.com`, `EMAIL_PASSWORD=bwiw xwdp uzxf mynq`
  - `FRONTEND_URL=http://localhost:5173`, `PORT=5000`
- [ ] PostgreSQL is running
- [ ] Database created: `createdb booking_platform`
- [ ] Schema imported: `psql booking_platform < backend/schema.sql`
- [ ] Seed script ran: `npm run seed` — no errors
- [ ] Backend starts: `npm run dev` → `Server running on port 5000`

**API health check:**
- [ ] `GET http://localhost:5000/api/services` → returns JSON array of 8 services (test in browser or Postman)

**Notes:**
```
(add issues here)
```

---

### 1.2 Frontend Setup
- [ ] `cd frontend && npm install` — no errors
- [ ] `.env.local` configured:
  - `VITE_API_URL=http://localhost:5000/api`
  - `VITE_STRIPE_PUBLIC_KEY=pk_test_...`
- [ ] Frontend starts: `npm run dev` → `http://localhost:5173`
- [ ] Home page loads without console errors (check browser DevTools)
- [ ] No CORS errors in the browser console

**Notes:**
```
(add issues here)
```

---

## Phase 2: Navigation & Layout

- [ ] Navbar renders on every page
- [ ] Logo/brand name links back to `/`
- [ ] Navigating to an unknown route (e.g. `/xyz`) redirects to home (`/`)
- [ ] All navbar links work: Home, Services, My Bookings, Login/Register
- [ ] Footer renders (if applicable)

---

## Phase 3: Authentication

### 3.1 Registration (`/register`)
- [ ] Form renders: Full Name, Email, Password, Phone
- [ ] Submit empty form → validation errors shown
- [ ] Submit with invalid email format → error shown
- [ ] Submit with short password → error shown
- [ ] Submit with valid data → account created, redirected to home
- [ ] Toast notification shows on success
- [ ] Navbar updates to show user info and logout

**Test account created:**
```
Name:     
Email:    
Password: 
```

---

### 3.2 Login (`/login`)
- [ ] Form renders: Email, Password
- [ ] Wrong credentials → error message shown
- [ ] Correct credentials → redirected to home
- [ ] JWT token stored in `localStorage` (check DevTools → Application → Local Storage)
- [ ] Navbar shows user name / logout button after login

---

### 3.3 Session Persistence
- [ ] After login, **refresh the page** → still logged in (token persists)
- [ ] Open new tab to `http://localhost:5173` → still logged in

---

### 3.4 Logout
- [ ] Click logout → token cleared from localStorage
- [ ] Redirected to home or login
- [ ] Navbar reverts to Login/Register links
- [ ] Visiting `/bookings` after logout → redirected to `/login`

---

### 3.5 Protected Routes
- [ ] Logged-out user visits `/booking/:id` → redirected to `/login`
- [ ] Logged-out user visits `/checkout` → redirected to `/login`
- [ ] Logged-out user visits `/bookings` → redirected to `/login`
- [ ] Logged-out user visits `/admin` → redirected (not shown admin panel)
- [ ] Regular user visits `/admin` → redirected (not shown admin panel)

---

## Phase 4: Services

### 4.1 Services Page (`/services`)
- [ ] 8 services loaded and displayed
- [ ] Each card shows: name, image, price, duration, category
- [ ] Search box filters services by name in real time
- [ ] Category filter narrows down services correctly
- [ ] "Book Now" button visible on each service card

---

### 4.2 Service Detail
- [ ] Clicking a service shows detail view (or navigates to `/booking/:id`)
- [ ] Price and description correct
- [ ] "Book Now" on detail page works

---

## Phase 5: Booking Flow

### 5.1 Booking Form (`/booking/:id`)
- [ ] Booking form loads for the chosen service
- [ ] Service name and price displayed
- [ ] Date picker does **not** allow past dates
- [ ] Time slot dropdown populated
- [ ] Special requests field accepts text
- [ ] Submitting without selecting date/time → validation error
- [ ] "Proceed to Payment" works after all required fields filled

**Booking details:**
```
Service:          
Date:             
Time:             
Special requests: 
```

---

### 5.2 Checkout (`/checkout`)
- [ ] Order summary shows: service name, date, time, price
- [ ] Stripe card element renders (card input box visible)
- [ ] Entering invalid card → error shown

**Test Cards:**
| Card Number | Expected Result |
|---|---|
| `4242 4242 4242 4242` | ✅ Payment succeeds |
| `4000 0000 0000 0002` | ❌ Card declined |
| `4000 2500 0000 3010` | 🔐 3D Secure required |

- [ ] Success card → payment processes, redirected to `/booking-success`
- [ ] Declined card → decline error shown, stays on checkout
- [ ] 3DS card → 3D Secure popup shown

---

### 5.3 Booking Success (`/booking-success`)
- [ ] Success page shows booking confirmation details
- [ ] Confirmation email received in inbox
- [ ] Email contains: service name, date, time, price
- [ ] Booking appears in "My Bookings" with status `pending` or `confirmed`

---

## Phase 6: My Bookings (`/bookings`)

### 6.1 Booking History
- [ ] List of all bookings shown
- [ ] Each booking shows: service, date, time, status, price
- [ ] Status badge correct (pending / confirmed / cancelled)

---

### 6.2 Cancel Booking
- [ ] "Cancel" button visible on bookings that can be cancelled
- [ ] Click Cancel → booking status changes to `cancelled`
- [ ] Cancelled booking shows updated status
- [ ] Cannot cancel an already cancelled booking

---

## Phase 7: Admin Panel

### 7.1 Admin Login
- [ ] Login with: `admin@servicehub.com` / `admin123`
- [ ] Redirected to `/admin` dashboard
- [ ] Admin-specific navbar or links visible

---

### 7.2 Dashboard (`/admin`)
- [ ] KPI card: Total Bookings — matches actual count
- [ ] KPI card: Total Revenue — calculated correctly
- [ ] KPI card: Confirmed Bookings count
- [ ] KPI card: Pending Bookings count
- [ ] Quick navigation links to `/admin/bookings` and `/admin/services` work

---

### 7.3 Manage Bookings (`/admin/bookings`)
- [ ] All bookings from all users are listed
- [ ] Filter by status works (pending / confirmed / cancelled)
- [ ] Update status: `pending` → `confirmed`
- [ ] Update status: `confirmed` → `cancelled`
- [ ] After status update, verify user receives email notification
- [ ] Updated status reflects immediately in the table

---

### 7.4 Manage Services (`/admin/services`)
- [ ] All 8 services listed
- [ ] **Create service:** fill in name, description, price, duration, category, image URL → saved
- [ ] New service appears on `/services` page for regular users
- [ ] **Edit service:** change price → saved → reflected on services page
- [ ] **Delete service:** service removed from `/services` page

---

## Phase 8: Stripe Webhook (Advanced)

> This tests that booking status updates automatically after payment

- [ ] After a successful payment, check the database — booking status should change from `pending` to `confirmed` (this is done by the webhook at `/api/webhooks/stripe`)
- [ ] Check backend terminal logs — should show `Webhook received` on payment
- [ ] If testing locally, use **Stripe CLI**: `stripe listen --forward-to localhost:5000/api/webhooks/stripe`

**Notes:**
```
(webhook observations here)
```

---

## Phase 9: Edge Cases & Error Handling

- [ ] Submit booking form with no date/time → form validation error
- [ ] Visit `/booking/9999` (non-existent service ID) → graceful error or redirect
- [ ] Stop the backend server → frontend shows a user-friendly connection error
- [ ] Duplicate registration with same email → error: "email already in use"
- [ ] Login with SQL injection attempt (e.g. `' OR 1=1 --`) → rejected safely
- [ ] Enter a past date manually in the booking form → rejected

---

## Phase 10: Responsiveness & Cross-Browser

### Mobile (375px width)
- [ ] Home page renders correctly
- [ ] Services page cards stack vertically
- [ ] Booking form is usable
- [ ] Checkout form is usable
- [ ] My Bookings page readable
- [ ] Admin dashboard readable (tables scroll horizontally)

### Tablet (768px width)
- [ ] Services grid adjusts to 2 columns
- [ ] Booking form layout looks correct

### Cross-Browser
- [ ] Chrome ✅ / ❌
- [ ] Firefox ✅ / ❌
- [ ] Edge ✅ / ❌

---

## Test Results Summary

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Setup | ⏳ | |
| 2. Navigation | ⏳ | |
| 3. Authentication | ⏳ | |
| 4. Services | ⏳ | |
| 5. Booking & Payment | ⏳ | |
| 6. My Bookings | ⏳ | |
| 7. Admin Panel | ⏳ | |
| 8. Stripe Webhook | ⏳ | |
| 9. Edge Cases | ⏳ | |
| 10. Responsiveness | ⏳ | |

---

## Bugs / Issues Found

| # | Description | Page / File | Severity | Status |
|---|-------------|-------------|----------|--------|
| 1 | | | High/Med/Low | Open |
| 2 | | | | Open |
| 3 | | | | Open |
