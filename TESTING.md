# 🧪 Testing Guide - Service Booking Platform

Use this file to track your testing progress. Mark each step as ✅ (pass), ❌ (fail), or ⏳ (pending).

---

## Phase 1: Project Setup

### 1.1 Backend Setup
- [ ] `cd backend && npm install` — dependencies installed
- [ ] `.env` configured (DB credentials, JWT secret, Stripe keys, email)
- [ ] Database created: `createdb booking_platform`
- [ ] Schema imported: `psql booking_platform < backend/schema.sql`
- [ ] Seed script ran: `npm run seed`
- [ ] Backend server starts: `npm run dev` → running on `http://localhost:5000`

**Notes:**
```
(add any issues or observations here)
```

---

### 1.2 Frontend Setup
- [ ] `cd frontend && npm install` — dependencies installed
- [ ] `.env.local` configured (`VITE_API_URL`, `VITE_STRIPE_PUBLIC_KEY`)
- [ ] Frontend starts: `npm run dev` → running on `http://localhost:5173`
- [ ] Home page loads without errors

**Notes:**
```
(add any issues or observations here)
```

---

## Phase 2: Authentication

### 2.1 Registration
- [ ] Navigate to `/register`
- [ ] Form renders correctly (name, email, password, phone)
- [ ] Submit with invalid data → validation error shown
- [ ] Submit with valid data → account created, redirected
- [ ] Toast notification shown on success

**Test data used:**
```
Name: 
Email: 
Password: 
```

---

### 2.2 Login
- [ ] Navigate to `/login`
- [ ] Login with wrong credentials → error message shown
- [ ] Login with correct credentials → redirected to home
- [ ] Auth token stored (check localStorage)
- [ ] Navbar updates to show user name / logout button

---

### 2.3 Logout
- [ ] Click logout → session cleared
- [ ] Redirected to `/login` or home
- [ ] Protected pages no longer accessible

---

## Phase 3: Services

### 3.1 Browse Services
- [ ] Navigate to `/services`
- [ ] 8 services displayed with name, image, price, duration
- [ ] Search/filter by category works
- [ ] Clicking a service shows detail view

---

## Phase 4: Booking Flow

### 4.1 Book a Service
- [ ] Click "Book Now" on any service
- [ ] Booking form loads (`/booking/:id`)
- [ ] Cannot select past dates
- [ ] Time slot selection works
- [ ] Special requests field available
- [ ] "Proceed to Payment" button enabled after valid inputs

**Service booked:**
```
Service: 
Date: 
Time: 
```

---

### 4.2 Stripe Payment (Test Mode)
- [ ] Checkout page loads (`/checkout`)
- [ ] Order summary visible (service, date, price)
- [ ] Stripe card element renders
- [ ] Test card accepted: `4242 4242 4242 4242` (any future date, any CVC)
- [ ] Payment processes successfully
- [ ] Redirected to success page (`/booking-success`)

**Test card declined:**
- [ ] Card `4000 0000 0000 0002` shows decline error correctly

---

### 4.3 Booking Confirmation
- [ ] Success page shows booking details
- [ ] Confirmation email received in inbox
- [ ] Email contains: service name, date, time, price

---

## Phase 5: My Bookings

### 5.1 Booking History
- [ ] Navigate to `/bookings`
- [ ] Shows list of bookings with status (pending/confirmed/cancelled)
- [ ] Booking details are correct

### 5.2 Cancel Booking
- [ ] Click "Cancel" on a booking
- [ ] Confirmation prompt shown (optional)
- [ ] Booking status changes to "cancelled"
- [ ] Cancelled booking no longer editable

---

## Phase 6: Admin Panel

### 6.1 Admin Login
- [ ] Login with `admin@servicehub.com` / `admin123`
- [ ] Redirected to admin dashboard (`/admin`)
- [ ] Non-admin users cannot access `/admin` (redirected)

---

### 6.2 Dashboard KPIs
- [ ] Total bookings count shown
- [ ] Revenue total shown
- [ ] Confirmed bookings count shown
- [ ] Pending bookings count shown

---

### 6.3 Manage Bookings (`/admin/bookings`)
- [ ] All user bookings listed in table
- [ ] Filter by status works
- [ ] Update status: pending → confirmed
- [ ] Update status: confirmed → cancelled
- [ ] Status change triggers email notification to user

---

### 6.4 Manage Services (`/admin/services`)
- [ ] Existing services listed
- [ ] Create new service works (name, description, price, duration, category, image URL)
- [ ] Edit existing service works
- [ ] Delete service works
- [ ] Changes reflected on `/services` page

---

## Phase 7: Edge Cases & Error Handling

- [ ] Accessing protected route while logged out → redirected to login
- [ ] Accessing `/admin` as a regular user → redirected
- [ ] Backend offline → frontend shows connection error gracefully
- [ ] Form submitted with missing required fields → validation errors shown
- [ ] Booking in the past → date picker blocks it or validation rejects

---

## Phase 8: Responsiveness

- [ ] Home page looks correct on mobile (375px)
- [ ] Services page looks correct on tablet (768px)
- [ ] Navbar collapses on mobile
- [ ] Booking form usable on mobile
- [ ] Admin dashboard readable on smaller screens

---

## Test Results Summary

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Setup | ⏳ | |
| 2. Auth | ⏳ | |
| 3. Services | ⏳ | |
| 4. Booking & Payment | ⏳ | |
| 5. My Bookings | ⏳ | |
| 6. Admin Panel | ⏳ | |
| 7. Edge Cases | ⏳ | |
| 8. Responsiveness | ⏳ | |

---

## Bugs / Issues Found

| # | Description | File/Location | Status |
|---|-------------|---------------|--------|
| 1 | | | Open |
| 2 | | | Open |
| 3 | | | Open |
