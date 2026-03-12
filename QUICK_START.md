# Quick Reference Guide

## 🚀 Starting the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## 🔑 Default Accounts

### Admin Account
```
Email: admin@servicehub.com
Password: admin123
Role: admin (can manage services and all bookings)
```

## 📸 Sample Services Seeded

1. **Home Cleaning** - $75/hour
2. **Electrical Repair** - $100/hour
3. **Plumbing Service** - $90/hour
4. **Car Detailing** - $120/service
5. **House Painting** - $200/room
6. **Lawn Care** - $50/hour
7. **HVAC Service** - $150/hour
8. **Pet Grooming** - $80/service

## 🔗 Main Routes

### Public Routes
- `/` - Home page
- `/services` - Browse services
- `/login` - Login page
- `/register` - Register page

### Protected Routes (Login Required)
- `/booking/:id` - Book a service
- `/checkout` - Stripe payment
- `/bookings` - View my bookings
- `/booking-success` - Confirmation page

### Admin Routes (Admin Login Required)
- `/admin` - Dashboard with analytics
- `/admin/bookings` - Manage all bookings
- `/admin/services` - Manage services (CRUD)

## 💳 Stripe Test Cards

| Card | Result | Expiry | CVC |
|------|--------|--------|-----|
| 4242 4242 4242 4242 | Success | Any future | Any 3 digits |
| 4000 0000 0000 0002 | Decline | Any future | Any 3 digits |
| 5555 5555 5555 4444 | Success | Any future | Any 3 digits |

## 📧 Email Notifications

Sent automatically when:
- ✅ User registers
- ✅ Booking is created (status: pending)
- ✅ Booking confirmed via Stripe webhook
- ✅ Booking status updated by admin
- ✅ Booking cancelled

## 🗄️ Database Commands

```bash
# Connect to database
psql -U postgres -d booking_platform

# View tables
\dt

# View schema
\d bookings

# Query counts
SELECT COUNT(*) FROM bookings;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM services;

# Exit
\q
```

## 🐛 Common Issues & Solutions

### Port 5000 in use
```bash
lsof -ti:5000 | xargs kill -9
```

### Port 5173 in use
```bash
lsof -ti:5173 | xargs kill -9
```

### Database not found
```bash
createdb booking_platform
psql -U postgres -d booking_platform < backend/schema.sql
```

### Reset database
```bash
dropdb booking_platform
createdb booking_platform
psql -U postgres -d booking_platform < backend/schema.sql
npm run seed
```

### Dependencies not installing
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

## 📝 Environment File Checklist

### backend/.env
- [ ] DB_HOST
- [ ] DB_USER
- [ ] DB_PASSWORD
- [ ] DB_NAME=booking_platform
- [ ] JWT_SECRET
- [ ] STRIPE_SECRET_KEY (sk_test_)
- [ ] STRIPE_WEBHOOK_SECRET (whsec_)
- [ ] EMAIL_USER
- [ ] EMAIL_PASSWORD
- [ ] FRONTEND_URL=http://localhost:5173
- [ ] PORT=5000

### frontend/.env.local
- [ ] VITE_API_URL=http://localhost:5000/api
- [ ] VITE_STRIPE_PUBLIC_KEY (pk_test_)

## 🎯 User Flow

### Registration & Booking Flow
1. **Register** → `/register` page
2. **Browse Services** → `/services` page
3. **Select Service** → Click "Book Now"
4. **Booking Details** → `/booking/:id` (date, time, requests)
5. **Payment** → `/checkout` (Stripe embedded checkout)
6. **Confirmation** → `/booking-success` page + email
7. **View Booking** → `/bookings` page (my bookings)

### Admin Flow
1. **Login** → Use admin@servicehub.com / admin123
2. **Dashboard** → `/admin` (view analytics)
3. **Manage Bookings** → `/admin/bookings` (approve/cancel)
4. **Manage Services** → `/admin/services` (CRUD)

## 📊 Booking Status Flow

```
User Books → PENDING
             ↓
             (Stripe Payment)
             ↓
Webhook Confirms → CONFIRMED
             ↓
User/Admin Can Cancel → CANCELLED
             ↓
After Service → COMPLETED (manual)
```

## 🔍 Testing Checklist

- [ ] Register new user account
- [ ] Login with registered account
- [ ] Browse services page
- [ ] Click book on a service
- [ ] Fill booking form
- [ ] Go to checkout
- [ ] Complete payment with test card
- [ ] See success confirmation
- [ ] Check booking in "My Bookings"
- [ ] Receive confirmation email
- [ ] Login as admin
- [ ] View all bookings in admin
- [ ] Update booking status
- [ ] Add/delete services as admin

## 🌐 API Base URL

```javascript
// In frontend
const API_URL = 'http://localhost:5000/api'

// All requests use axios interceptor to add Bearer token
// Example: GET /api/bookings automatically includes Authorization header
```

## 📱 Responsive Breakpoints

Using Tailwind CSS:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

All components are fully responsive using Tailwind's mobile-first approach.
