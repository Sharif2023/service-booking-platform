# Service Booking Platform - Complete Setup Guide

## 🚀 Quick Start

This is a professional service booking platform featuring user authentication, service browsing, Stripe payment integration, email confirmations, and an admin dashboard.

### System Requirements
- Node.js 18+
- PostgreSQL 12+
- npm or yarn
- A Stripe account (free dev account)
- A Gmail account (for Nodemailer)

---

## 📋 Installation Steps

### 1. Database Setup

#### Option A: Using PostgreSQL directly
```bash
# Create database
createdb booking_platform

# Run schema
psql booking_platform < backend/schema.sql
```

#### Option B: Using Docker (Recommended)
```bash
# Create docker-compose.yml in project root if not exists
docker-compose up -d

# Run schema from container
docker exec -i postgres_container psql -U postgres -d booking_platform < backend/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Seed initial data (8 services + admin user)
npm run seed

# Start dev server
npm run dev
```

**Backend will run on**: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start dev server
npm run dev
```

**Frontend will run on**: `http://localhost:5173`

---

## 🔑 Environment Variables Setup

### Backend `.env`
```env
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=booking_platform

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend
FRONTEND_URL=http://localhost:5173

# Server
PORT=5000
```

### Frontend `.env.local`
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 📧 Email Setup (Nodemailer + Gmail)

1. Enable 2-factor authentication on Gmail
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASSWORD` in backend `.env`

---

## 💳 Stripe Setup

1. Create free Stripe account: https://stripe.com
2. Go to Developers → API Keys
3. Copy `Secret Key` and `Publishable Key`
4. Paste into backend `.env` and frontend `.env.local`

### Testing Stripe
**Use this test card**: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

---

## 🔐 Admin Access

**Default Admin Credentials** (created by seed script):
- Email: `admin@servicehub.com`
- Password: `admin123`

**First Time Setup**:
1. Visit `http://localhost:5173/login`
2. Login with admin credentials
3. Navigate to `/admin` to see admin dashboard

---

## ✅ Verification Checklist

After setup, test the complete flow:

### User Registration & Login
- [ ] Visit `/register` and create a test account
- [ ] Confirm email and password work
- [ ] Can login with created account
- [ ] Can logout

### Services & Browsing
- [ ] `/services` page loads with 8 services
- [ ] Can see service details, price, duration
- [ ] Search/filter works

### Booking Flow
- [ ] Click "Book Now" on a service
- [ ] Select date, time, and add special requests
- [ ] "Proceed to Payment" button works

### Stripe Payment
- [ ] Checkout page loads correctly
- [ ] Card element renders (Stripe integration)
- [ ] Test card `4242 4242 4242 4242` processes payment
- [ ] Success page confirms booking

### Email Confirmation
- [ ] Check email for booking confirmation
- [ ] Confirmation shows service details, date/time, price

### User Bookings History
- [ ] `/bookings` shows all past and upcoming bookings
- [ ] Can see booking status (pending/confirmed/cancelled)
- [ ] Can cancel confirmed bookings

### Admin Dashboard
- [ ] Login as admin (`admin@servicehub.com`)
- [ ] See KPIs: total bookings, revenue, etc.
- [ ] Can view all bookings from all users
- [ ] Can change booking status
- [ ] Can view, create, edit, delete services

---

## 🚀 Production Deployment

###  Frontend Deployment (Vercel/Netlify)

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend folder
cd frontend
vercel
```

**Netlify:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy from frontend folder
cd frontend
netlify deploy --prod --dir=dist
```

### Backend Deployment (Railway/Heroku)

**Railway:**
1. Push to GitHub
2. Connect repo to Railway
3. Add environment variables
4. Deploy

**Heroku:**
```bash
# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret

# Push and deploy
git push heroku main
```

---

## 🗄️ Database Models

### Users Table
```sql
id, email, password_hash, full_name, phone, created_at, updated_at
```

### Services Table
```sql
id, name, description, price, duration_minutes, category, image_url, created_at, updated_at
```

### Bookings Table
```sql
id, user_id, service_id, booking_date, booking_time, special_requests, 
status (pending/confirmed/cancelled/completed), stripe_session_id, stripe_payment_id, 
created_at, updated_at
```

### Admin Users Table
```sql
id, email, password_hash, full_name, role, created_at, updated_at
```

---

## 📁 Project Structure

```
service-booking-platform/
├── backend/
│   ├── src/
│   │   ├── config/         (database, stripe, email)
│   │   ├── models/         (User, Service, Booking)
│   │   ├── routes/         (auth, services, bookings, admin, webhook)
│   │   └── middleware/     (auth, error handling)
│   ├── scripts/
│   │   └── seedDatabase.js
│   ├── schema.sql
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/     (Navbar, Layout, Toast, Guards)
│   │   ├── pages/          (Home, Services, Booking, Checkout, Admin)
│   │   ├── context/        (Auth, Notification, Booking)
│   │   ├── hooks/          (useAuth, useNotification, useBooking)
│   │   ├── services/       (API client with axios)
│   │   ├── config/         (constants, stripe config)
│   │   ├── App.jsx         (routing)
│   │   ├── main.jsx        (entry point)
│   │   └── index.css       (tailwind)
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
└── README.md
```

---

## 🛠️ Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify DB_HOST and credentials in `.env`
- Check port 5000 is not in use

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env.local`
- Check CORS is enabled in backend

### Stripe not working
- Verify `STRIPE_PUBLIC_KEY` matches backend `STRIPE_SECRET_KEY`
- Use test card `4242 4242 4242 4242`
- Check webhook secret is correct

### Email not sending
- Enable Less Secure App Access (if not using app password)
- Use app password from Google Account Security
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in backend `.env`

### Admin can't login
- Re-run seed script: `npm run seed` (backend)
- Check admin email: `admin@servicehub.com`
- Check admin password: `admin123`

---

## 📚 Key Features

✅ **User Authentication**
- JWT tokens with 7-day expiry
- Secure password hashing with bcryptjs
- Session persistence with localStorage

✅ **Service Management**
- Browse all services with filtering and search
- 8 pre-loaded services across categories
- Admin can create/edit/delete services

✅ **Booking System**
- Select service, date, time, special requests
- Professional booking form with validation
- Booking history with status tracking

✅ **Stripe Payment Integration**
- Secure checkout with Stripe Elements
- Test and production ready
- Session-based payment tracking

✅ **Email Notifications**
- HTML email templates
- Booking confirmations sent automatically
- Nodemailer with Gmail integration

✅ **Admin Dashboard**
- 4 KPI cards (total bookings, revenue, etc.)
- View and manage all bookings
- Full service CRUD operations
- Status management with email notifications

✅ **Premium UI/UX**
- Dark mode with gradient accents
- Responsive design (mobile-first)
- Smooth animations and transitions
- Professional component library with Tailwind CSS

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review .env file configuration
3. Check backend/frontend console for errors
4. Verify all services are running

---

## 📄 License

This project is provided as-is for recruiting portfolio purposes.
