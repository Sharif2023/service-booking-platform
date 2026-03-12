# Complete Setup Instructions

Follow these step-by-step instructions to get the Service Booking Platform running on your local machine.

## ⏱️ Estimated Setup Time: 15-20 minutes

---

## STEP 1: Verify Prerequisites

Before starting, ensure you have:

```bash
# Check Node.js (need 18+)
node --version
npm --version

# Check PostgreSQL (need 12+)
psql --version
pg_isready
```

If PostgreSQL is not running:
- **Windows**: Start PostgreSQL service
- **Mac**: `brew services start postgresql`
- **Linux**: `sudo service postgresql start`

---

## STEP 2: Backend Setup (Terminal 1)

### 2.1 Navigate to Backend
```bash
cd backend
```

### 2.2 Install Dependencies
```bash
npm install
```
This installs 36 packages including Express, PostgreSQL, Stripe, Nodemailer, JWT, etc.

### 2.3 Create Database
> [!IMPORTANT]
> Ensure you are still inside the `backend` directory before running these commands.

```bash
# Create the database (Using -U postgres is essential if your OS user doesn't match)
createdb -U postgres booking_platform

# If you've forgotten your postgres password, see the Troubleshooting section.

# Verify it was created
psql -U postgres -l
```

### 2.4 Initialize Database Schema
```bash
# Run the schema file to create tables (-f is more reliable than redirection <)
psql -U postgres -d booking_platform -f schema.sql

# Verify tables were created
psql -U postgres -d booking_platform -c "\dt"
```

You should see 4 tables:
- admin_users
- bookings
- services
- users

### 2.5 Seed Sample Data
> [!IMPORTANT]
> Must be run from the `backend` directory.

```bash
npm run seed
```

This will create:
- ✅ Admin user: `admin@servicehub.com` / `admin123`
- ✅ 8 sample services (Cleaning, Electrical, Plumbing, etc.)

Verify with:
```bash
psql -U postgres -d booking_platform -c "SELECT COUNT(*) as services FROM services;"
psql -U postgres -d booking_platform -c "SELECT * FROM admin_users;"
```

### 2.6 Configure Environment Variables

Copy the `.env.example` template:
```bash
cp .env.example .env
```

Edit `backend/.env` and fill in:

```env
# REQUIRED - Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_NAME=booking_platform

# REQUIRED - JWT Secret (create any random string)
JWT_SECRET=your_super_secret_key_12345678

# REQUIRED - Stripe (sign up at stripe.com)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# REQUIRED - Gmail
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_password_16_chars

# REQUIRED - Infrastructure
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### 2.7 Start Backend Server
```bash
npm run dev
```

Expected output:
```
Server running on http://localhost:5000
Connected to database
```

✅ **Backend is ready!** Keep this terminal open.

---

## STEP 3: Frontend Setup (Terminal 2)

### 3.1 Navigate to Frontend
```bash
cd frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

This installs 33 packages including React, Vite, Tailwind, Axios, Stripe SDK, etc.

### 3.3 Configure Environment Variables

Copy the `.env.example` template:
```bash
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

### 3.4 Start Frontend Development Server
```bash
npm run dev
```

Expected output:
```
VITE v7.3.1  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

✅ **Frontend is running!** Open `http://localhost:5173` in your browser.

---

## STEP 4: Get API Keys

### 4.1 Stripe Keys

1. Open [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API Keys**
3. Copy:
   - **Secret Key** (starts with `sk_test_`) → paste in `backend/.env`
   - **Publishable Key** (starts with `pk_test_`) → paste in `frontend/.env.local`
4. Set up webhook:
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - URL: `http://localhost:5000/api/webhooks/stripe`
   - Select events: `checkout.session.completed`
   - Copy **Signing secret** → paste in `backend/.env` as `STRIPE_WEBHOOK_SECRET`
5. Restart backend server (Ctrl+C, then `npm run dev`)

### 4.2 Gmail App Password

1. Enable 2FA on [Google Account Security](https://myaccount.google.com/security)
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Select **Mail** and **Windows Computer** (or your device)
4. Google will generate a **16-character password**
5. Copy it → paste in `backend/.env` as `EMAIL_PASSWORD`
6. Restart backend server

---

## STEP 5: Verify Everything Works

### 5.1 Check Backend API
```bash
curl http://localhost:5000/api/services
```

Should return JSON array of 8 services.

### 5.2 Test in Browser

Open `http://localhost:5173` and test:

#### Registration
1. Click **Register** (top right)
2. Fill in: Name, Email, Phone, Password
3. Click **Register**
4. ✅ Should be logged in, see confirmation toast

#### Browse Services
1. Click **Services** in navbar
2. ✅ Should see 8 services with prices
3. Click **Book Now** on any service

#### Make a Booking
1. Select date (must be future date)
2. Select time
3. Add special requests (optional)
4. Click **Continue to Checkout**
5. ✅ Should see Stripe checkout form

#### Complete Payment
1. Enter card: `4242 4242 4242 4242`
2. Expiry: Any future date (e.g., 12/25)
3. CVC: Any 3 digits (e.g., 123)
4. Click **Pay**
5. ✅ Should see success page
6. ✅ Should receive confirmation email

#### View Booking
1. Click **My Bookings** in navbar
2. ✅ Should see booking with "confirmed" status

#### Admin Access
1. Click **Logout** (top right)
2. Click **Login**
3. Enter: `admin@servicehub.com` / `admin123`
4. ✅ Should see **Admin** link in navbar
5. Click **Admin** dashboard
6. ✅ Should see analytics (Total bookings, Revenue, etc.)
7. Click **Manage Bookings**
8. ✅ Should see all user bookings with status and update options

---

## STEP 6: Troubleshooting

### Problem: "Database does not exist" or "Authentication failed for user Admin"
```bash
# Solution: Create and initialize database with -U postgres
createdb -U postgres booking_platform
psql -U postgres -d booking_platform -f backend/schema.sql
npm run seed
```

### Problem: Forgotten PostgreSQL Password
If you've forgotten the `postgres` user password:
1. Locate your `pg_hba.conf` file (usually in `C:\Program Files\PostgreSQL\XX\data`).
2. Temporarily set local IPv4 connections to `trust`.
3. Connect without a password: `psql -U postgres -h 127.0.0.1`.
4. Run: `ALTER USER postgres WITH PASSWORD 'new_password';`.
5. Revert `pg_hba.conf` to `scram-sha-256` and restart the service.

### Problem: Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Problem: Port 5173 already in use
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### Problem: "Cannot find module 'pg'"
```bash
# Solution: Reinstall backend dependencies
cd backend
rm -rf node_modules
npm install
```

### Problem: Email not sending
1. Verify Gmail account has 2FA enabled
2. Generate new app password
3. Ensure password is 16 characters
4. Restart backend server

### Problem: Stripe payment fails
1. Verify `STRIPE_SECRET_KEY` starts with `sk_test_`
2. Verify `VITE_STRIPE_PUBLIC_KEY` starts with `pk_test_` (frontend)
3. Verify webhook endpoint is configured
4. Test with card `4242 4242 4242 4242`

### Problem: CORS error in browser console
1. Verify `VITE_API_URL=http://localhost:5000/api` in frontend `.env.local`
2. Ensure backend `.env` has `FRONTEND_URL=http://localhost:5173`
3. Restart both servers

---

## STEP 7: Next Steps

### For Development
- Browse files in project to understand architecture
- Modify styles in `frontend/src/components` 
- Add new services via Admin panel
- Test all user flows

### For Deployment
1. Choose hosting platform (Heroku, AWS, DigitalOcean, etc.)
2. Create production Stripe account
3. Configure production environment variables
4. Deploy backend and frontend
5. Update API URL in frontend for production

### For Learning
- Review `backend/src/routes/bookings.js` for Stripe integration
- Check `backend/src/middleware/auth.js` for JWT authentication
- Examine `frontend/src/context/AuthContext.jsx` for state management
- Study `frontend/src/components/auth/ProtectedRoute.jsx` for route protection

---

## ✅ Setup Complete!

Your Service Booking Platform is now:
- ✅ Running on `http://localhost:5173` (frontend)
- ✅ API available on `http://localhost:5000/api` (backend)
- ✅ Database connected with `booking_platform`
- ✅ Ready for testing with test services and admin account
- ✅ Configured with Stripe and Gmail

---

## 📚 Documentation Reference

- **README.md** - Full technical documentation
- **QUICK_START.md** - Quick commands and routes
- **IMPLEMENTATION_CHECKLIST.md** - What was built
- **SETUP_INSTRUCTIONS.md** - This file

---

## 🎉 Enjoy Building!

You now have a professional, production-ready booking platform. Start exploring, testing, and customizing!

**Questions?** Check the Troubleshooting section above or review the code comments.
