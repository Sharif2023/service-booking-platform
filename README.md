# ServiceHub - Premium Service Booking Platform

An ultra-modern, enterprise-grade service booking platform built with the **PERN + Stripe** stack (PostgreSQL, Express, React, Node.js). Engineered for performance, elegance, and business precision.

## 🎯 Features

✅ **User Authentication** - Register, login, logout with JWT tokens  
✅ **Service Catalog** - Browse all available services with images and pricing  
✅ **Online Booking** - Book services with date, time, and special requests  
✅ **Stripe Integration** - Secure payment processing with Stripe checkout  
✅ **Email Confirmations** - Booking confirmations via Nodemailer  
✅ **Booking History** - View and manage user bookings  
✅ **Admin Dashboard** - View analytics, manage bookings and services  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

## 🛠️ Tech Stack

### Frontend
- React 18.2.0 with Vite 7.3.1
- React Router v6 for navigation
- Tailwind CSS 4.2.1 for styling
- Axios for API calls
- Stripe SDK for payments
- Context API for state management

### Backend
- Node.js + Express 5.2.1
- PostgreSQL for data storage
- JWT for authentication
- Stripe SDK for payments
- Nodemailer for email
- express-validator for validation

### Database
- PostgreSQL 12+
- 4 tables: users, services, bookings, admin_users
- Indexes for performance optimization

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (with psql client)
- Stripe account (free tier works)
- Gmail account with app password for emails
- Git (optional)

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `backend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=booking_platform

JWT_SECRET=your_super_secret_jwt_key

STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

FRONTEND_URL=http://localhost:5173
PORT=5000
```

Create database and initialize schema:
```bash
# Create database
createdb booking_platform

# Initialize schema
psql -U postgres -d booking_platform < schema.sql

# Seed sample data
npm run seed
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Edit `frontend/.env.local`:
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

Start frontend:
```bash
npm run dev
```

## 📁 Project Structure

```
service-booking-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Stripe, Email
│   │   ├── models/          # User, Service, Booking
│   │   ├── routes/          # API endpoints
│   │   └── middleware/      # Auth, Admin checks
│   ├── schema.sql           # Database schema
│   ├── server.js            # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # All page components
│   │   ├── components/      # Shared components
│   │   ├── context/         # State management
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API client
│   │   ├── App.jsx          # Main app
│   │   └── main.jsx         # Entry point
│   └── package.json
│
└── README.md
```

## 🔐 Getting API Keys

### Stripe
1. Create account at [stripe.com](https://stripe.com)
2. Dashboard → Developers → API Keys
3. Copy Secret Key (sk_test_) and Publishable Key (pk_test_)
4. For webhook: Developers → Webhooks → Add endpoint
   - URL: `http://localhost:5000/api/webhooks/stripe`
   - Copy signing secret (whsec_)

### Gmail App Password
1. Enable 2FA on Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select Mail, Windows Computer
4. Copy generated 16-character password

## 🧪 Testing

### Stripe Test Cards
- `4242 4242 4242 4242` - Success
- `4000 0000 0000 0002` - Decline
- Any future expiry date and CVC

### Admin Account
- Email: `admin@servicehub.com`
- Password: `admin123`

## 📊 Database Schema

### users
- id, email (unique), password (hashed), full_name, phone, created_at

### services
- id, name, description, price, image_url, created_at

### bookings
- id, user_id, service_id, booking_date, booking_time, special_requests, status, stripe_session_id, created_at

### admin_users
- user_id, role, created_at

## 🔄 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Services
- `GET /api/services` - List all
- `GET /api/services/:id` - Get details
- `POST/PUT/DELETE /api/services` - Manage (admin only)

### Bookings
- `POST /api/bookings/create-session` - Create Stripe session
- `GET /api/bookings` - Get user bookings
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Admin
- `GET /api/admin/bookings` - All bookings
- `PATCH /api/admin/bookings/:id/status` - Update status
- `GET /api/admin/analytics` - Dashboard stats

## 🔒 Security

- Passwords: bcryptjs (10 rounds)
- Auth: JWT tokens (7-day expiry)
- SQL: Prepared statements
- Stripe: Webhook signature validation
- CORS: Configured for frontend origin

## 🚀 Deployment

Before going live:
1. Update environment variables for production
2. Use production Stripe keys
3. Set strong JWT_SECRET
4. Configure database backups
5. Enable HTTPS
6. Update FRONTEND_URL

---

**Built with passion for service booking. Ready for production! 🎉**

### 🔐 User Authentication & Security
- **JWT-based authentication** with secure token management
- **Password hashing** using bcryptjs (salted 10 rounds)
- **Session persistence** with localStorage
- **Role-based access control** (admin vs regular users)
- **Protected routes** preventing unauthorized access

### 🛍️ Service Browsing & Booking
- **Browse 8+ pre-loaded professional services** across multiple categories
- **Advanced filtering** by category and search functionality
- **Detailed service pages** showing description, price, duration
- **Multi-step booking form** with date/time picker and special requests
- **Real-time form validation** with user-friendly error messages

### 💳 Stripe Payment Integration
- **Secure checkout** using Stripe Elements
- **PCI-compliant payment processing** (no card data touches server)
- **Webhook integration** for payment confirmation
- **Test mode support** with test cards provided
- **Idempotency** preventing duplicate charges
- **Session-based payment tracking** with order reconciliation

### 📧 Email Notifications
- **Professional HTML email templates** for booking confirmations
- **Automatic email sending** on successful payment
- **Gmail integration** via Nodemailer (app password supported)
- **Email customization** with booking details, date/time, service name

### 📋 Booking Management
- **User booking history** with filter by status (pending/confirmed/cancelled)
- **Cancel bookings** with one-click option
- **Booking status tracking** throughout lifecycle
- **Administrative bulk operations** for status management
- **Real-time status updates** with email notifications

### 👨‍💼 Professional Admin Dashboard
- **4 KPI cards** showing total bookings, revenue, confirmed/pending counts
- **All-users bookings view** with sortable table
- **Status management** (pending → confirmed → cancelled)
- **Service CRUD operations** (create, read, update, delete)
- **Analytics dashboard** with key metrics
- **Protected admin routes** with role-based authentication

### 🎨 Premium UI/UX
- **Dark mode design** with gradient accents (indigo, blue, purple)
- **Fully responsive** across mobile, tablet, desktop
- **Smooth animations** and micro-interactions
- **Toast notifications** for user feedback
- **Loading states** and error boundaries
- **Professional component library** (custom Tailwind CSS)
- **Accessibility considerations** (semantic HTML, ARIA labels)

---

## 🏗️ Architecture & Tech Stack

### Frontend Stack
| Layer | Technology | Purpose |
|-------|-----------|------|
| **Framework** | React 19 + Vite | Modern UI with fast HMR |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **Routing** | React Router v6 | Client-side navigation |
| **HTTP Client** | Axios | API requests with interceptors |
| **Payments** | @stripe/react-stripe-js | Secure payment collection |
| **State** | React Context API | Global state management |
| **Validation** | Native HTML5 | Form validation |

### Backend Stack
| Layer | Technology | Purpose |
|-------|-----------|------|
| **Framework** | Express.js | HTTP server and routing |
| **Database** | PostgreSQL | Relational data storage |
| **Driver** | pg | Node.js PostgreSQL client |
| **Authentication** | JWT | Token-based auth |
| **Password** | bcryptjs | Secure password hashing |
| **Payments** | Stripe SDK | Payment processing |
| **Email** | Nodemailer | Email sending |
| **Validation** | express-validator | Input validation |
| **CORS** | cors | Cross-origin requests |

### Database Schema
```
Users
├── id (PK)
├── email (UNIQUE)
├── password_hash
├── full_name
├── phone
└── timestamps

Services
├── id (PK)
├── name
├── description
├── price (DECIMAL)
├── duration_minutes
├── category
├── image_url
└── timestamps

Bookings
├── id (PK)
├── user_id (FK → Users)
├── service_id (FK → Services)
├── booking_date
├── booking_time
├── special_requests
├── status (pending|confirmed|cancelled|completed)
├── stripe_session_id
├── stripe_payment_id
└── timestamps

Admin_Users
├── id (PK)
├── email (UNIQUE)
├── password_hash
├── full_name
├── role
└── timestamps
```

---

## 🚀 Quick Start

### Prerequisites
```bash
# Check versions
node --version  # v18+
npm --version   # 9+
psql --version  # 12+
```

### Installation

#### 1. Clone & Setup Environment
```bash
git clone <repository>
cd service-booking-platform

# Backend setup
cd backend
cp .env.example .env
npm install

# Frontend setup
cd ../frontend
cp .env.example .env.local
npm install
```

#### 2. Database Setup
```bash
# Create database
createdb booking_platform

# Import schema
psql booking_platform < ../backend/schema.sql

# Seed initial data
cd ../backend
npm run seed
```

#### 3. Configure Environment Variables

**Backend `.env`:**
```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_NAME=booking_platform

JWT_SECRET=your_secret_key_here_change_in_production

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password

FRONTEND_URL=http://localhost:5173
PORT=5000
```

**Frontend `.env.local`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

#### 4. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Admin: http://localhost:5173/admin (admin@servicehub.com / admin123)

---

## 📖 Usage Guide

### For Customers

1. **Create Account** (`/register`)
   - Email, password, full name, phone
   - Automatic login after registration

2. **Browse Services** (`/services`)
   - Search by name or category
   - View service details, price, duration
   - Click "Book Now" to proceed

3. **Make a Booking** (`/booking/:id`)
   - Select date (no past dates)
   - Select preferred time
   - Add special requests (optional)
   - Click "Proceed to Payment"

4. **Checkout** (`/checkout`)
   - Review order summary
   - Enter card details (test: 4242 4242 4242 4242)
   - Complete payment

5. **Confirmation** 
   - See success page
   - Receive confirmation email
   - View in "My Bookings" (`/bookings`)

### For Admins

1. **Login as Admin**
   - Email: `admin@servicehub.com`
   - Password: `admin123`

2. **View Dashboard** (`/admin`)
   - See KPIs: bookings, revenue, confirmed/pending counts
   - Quick links to manage bookings and services

3. **Manage Bookings** (`/admin/bookings`)
   - View all customer bookings
   - Filter by status
   - Update status (triggers email notifications)
   - Change pending → confirmed → cancelled

4. **Manage Services** (`/admin/services`)
   - View, create, edit, delete services
   - Update name, description, price, duration, category
   - Mock image URLs supported

---

## 🔑 API Endpoints

### Authentication
```
POST /api/auth/register       → Register new user
POST /api/auth/login          → Login, receive JWT token
```

### Services (Public)
```
GET /api/services             → Get all services
GET /api/services/:id         → Get specific service
```

### Services (Admin Only)
```
POST /api/services            → Create new service
PUT /api/services/:id         → Update service
DELETE /api/services/:id      → Delete service
```

### Bookings (Protected)
```
POST /api/bookings/create-session   → Create booking + Stripe session
GET /api/bookings                   → Get user's bookings
PATCH /api/bookings/:id/cancel      → Cancel booking
```

### Admin Routes (Admin Only)
```
GET /api/admin/bookings             → View all bookings
PATCH /api/admin/bookings/:id/status → Update booking status
GET /api/admin/analytics             → Get dashboard KPIs
```

### Webhooks (Stripe)
```
POST /api/webhooks/stripe    → Stripe payment webhook
```

---

## 🔒 Security Features

✅ **Authentication**
- JWT tokens with 7-day expiration
- Secure token storage (localStorage)
- Token refresh on API calls

✅ **Password Security**
- bcryptjs hashing (10-round salt)
- Minimum 6 character requirement
- Never stored in plaintext

✅ **API Security**
- Input validation (express-validator)
- CORS enabled for frontend domain
- SQL injection prevention (prepared statements)
- XSS protection (React escaping)
- CSRF protection (HTTP-only cookies recommended for prod)

✅ **Payment Security**
- PCI compliance (Stripe handles card data)
- Webhook verification (Stripe signature)
- Idempotency for duplicate prevention
- Session-based payment tracking

✅ **Data Validation**
- Email format validation
- Date/time validation (no past bookings)
- Price validation (positive numbers)
- Status enum validation

---

## 📊 Performance Optimizations

- **Database indexes** on frequently queried columns (user_id, service_id, booking_date)
- **Lazy loading** for images and components
- **API request batching** to reduce network calls
- **Vite HMR** for instant frontend updates
- **Connection pooling** with pg for database
- **Caching** of service data in component state

---

## 🧪 Testing

### Manual Testing with Stripe

**Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Require Auth: `4000 2500 0000 3010`

**Expiry & CVC:** Any future date + any 3 digits

### Testing Checklist

- [ ] User registration with valid/invalid inputs
- [ ] Login/logout flow
- [ ] Service browsing and filtering
- [ ] Booking form validation (past dates rejected)
- [ ] Stripe payment flow (success & decline scenarios)
- [ ] Email notification delivery
- [ ] Admin dashboard KPI calculations
- [ ] Admin booking status updates
- [ ] Admin service CRUD operations
- [ ] Mobile responsiveness

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to strong random value
- [ ] Use real Stripe keys (not test keys)
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS with actual domain
- [ ] Set up database backups
- [ ] Configure email with professional SMTP
- [ ] Enable rate limiting on API
- [ ] Set up monitoring and error tracking
- [ ] Configure logging and audit trails
- [ ] Test payment flow end-to-end
- [ ] Review GDPR/privacy policies

---

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist folder
```

### Backend (Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Add environment variables
4. Deploy

---

## 🐛 Troubleshooting

**Backend won't connect to database:**
```bash
# Check PostgreSQL is running
psql --version

# Check credentials in .env
# Verify database exists: psql -l
```

**Frontend won't connect to backend:**
```bash
# Check backend is running on port 5000
curl http://localhost:5000

# Verify VITE_API_URL in .env.local
# Check browser console for CORS errors
```

**Stripe payment fails:**
- Verify STRIPE_PUBLIC_KEY matches
- Use test card 4242 4242 4242 4242
- Check webhook secret is configured

**Email not sending:**
- Enable Gmail app password
- Verify EMAIL_USER and EMAIL_PASSWORD
- Check SMTP settings in Nodemailer config

For more help, see [SETUP_GUIDE.md](./SETUP_GUIDE.md).

---

## 📁 Project Structure

```
service-booking-platform/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js        (PostgreSQL connection pool)
│   │   │   ├── stripe.js          (Stripe SDK initialization)
│   │   │   └── email.js           (Nodemailer + templates)
│   │   │
│   │   ├── models/
│   │   │   ├── User.js            (Authentication, user queries)
│   │   │   ├── Service.js         (Service CRUD)
│   │   │   └── Booking.js         (Booking lifecycle)
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js            (Register, login)
│   │   │   ├── services.js        (Public service routes)
│   │   │   ├── bookings.js        (Booking creation, checkout)
│   │   │   ├── admin.js           (Admin-only operations)
│   │   │   └── webhook.js         (Stripe webhook handler)
│   │   │
│   │   └── middleware/
│   │       └── auth.js            (JWT verification, role checks)
│   │
│   ├── scripts/
│   │   └── seedDatabase.js        (Initial data seeding)
│   │
│   ├── server.js                  (Express app entry point)
│   ├── schema.sql                 (Database DDL)
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx                (Landing page, featured services)
│   │   │   ├── ServicesPage.jsx            (Browse all services)
│   │   │   ├── BookingPage.jsx             (Dating, time, requests form)
│   │   │   ├── CheckoutPage.jsx            (Stripe payment)
│   │   │   ├── BookingSuccessPage.jsx      (Confirmation)
│   │   │   ├── MyBookingsPage.jsx          (User's bookings history)
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx      (KPIs, quick links)
│   │   │       ├── AdminBookingsPage.jsx   (View & manage bookings)
│   │   │       └── AdminServicesPage.jsx   (Service management)
│   │   │
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   │   ├── Navbar.jsx              (Navigation bar)
│   │   │   │   ├── Layout.jsx              (Page wrapper)
│   │   │   │   ├── Toast.jsx               (Notifications)
│   │   │   │   └── LoadingSpinner.jsx
│   │   │   └── auth/
│   │   │       ├── ProtectedRoute.jsx      (User auth guard)
│   │   │       └── AdminRoute.jsx          (Admin-only guard)
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx             (User & token state)
│   │   │   ├── NotificationContext.jsx     (Toast messages)
│   │   │   └── BookingContext.jsx          (Multi-page form state)
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useNotification.js
│   │   │   └── useBooking.js
│   │   │
│   │   ├── services/
│   │   │   └── api.js                      (Axios instance, all API calls)
│   │   │
│   │   ├── config/
│   │   │   └── constants.js                (API URL, Stripe key, routes)
│   │   │
│   │   ├── App.jsx                         (Router setup)
│   │   ├── main.jsx                        (React entry point)
│   │   └── index.css                       (Tailwind + globals)
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── SETUP_GUIDE.md                 (Detailed setup instructions)
└── README.md                      (This file)
```

---

## 💡 Key Implementation Details

### Authentication Flow
1. User registers/logs in
2. Backend generates JWT token (7-day expiry)
3. Frontend stores token in localStorage
4. Axios interceptor adds token to all requests
5. 401 errors trigger logout and redirect to login

### Booking Flow
1. User selects service, date, time
2. Frontend creates booking + Stripe session in one call
3. Backend returns sessionId
4. Stripe checkout opens with payment form
5. On success, webhook updates booking status to "confirmed"
6. Email sent automatically on confirmation

### Admin Flow
1. Admin logs in (JWT with admin role)
2. ProtectedRoute checks user exists
3. AdminRoute additionally checks role === 'admin'
4. Dashboard shows KPIs, quick links to management pages
5. Status updates trigger emails to customers

---

## 🎓 Learning Points

This project demonstrates:
- ✅ Full-stack MERN + PostgreSQL development
- ✅ JWT authentication and role-based authorization
- ✅ Stripe payment integration with webhooks
- ✅ Email notifications with HTML templates
- ✅ React hooks, context API, routing
- ✅ Form validation and error handling
- ✅ Responsive design with Tailwind CSS
- ✅ RESTful API design
- ✅ Database modeling and optimization
- ✅ Production-ready code patterns

---

## 📜 License

ISC License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Express.js](https://expressjs.com)
- [PostgreSQL](https://www.postgresql.org)
- [Stripe](https://stripe.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## 👤 Author

**Created for recruitment portfolio purposes**

Demonstrates professional full-stack development skills with emphasis on:
- Clean, maintainable code
- Security best practices
- User experience
- Production-ready architecture

---

## 📞 Support

For setup issues, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

For code questions or improvements, review the inline comments throughout the codebase.

---

**Happy coding! 🚀**