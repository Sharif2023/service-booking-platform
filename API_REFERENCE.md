# Architecture & API Reference

## 🏗️ System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                      http://localhost:5173                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Pages      │  │  Components  │  │  Context API (State) │  │
│  ├──────────────┤  ├──────────────┤  ├──────────────────────┤  │
│  │ Home         │  │ Navbar       │  │ AuthContext          │  │
│  │ Services     │  │ Layout       │  │ NotificationContext  │  │
│  │ Booking      │  │ Toast        │  │ BookingContext       │  │
│  │ Checkout     │  │ Routes       │  │                      │  │
│  │ MyBookings   │  │ Admin Pages  │  │                      │  │
│  │ Admin Panel  │  │              │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         Axios Instance + JWT Interceptor                  │ │
│  │  (Automatically adds Bearer token to all requests)         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↕
          HTTPS (in production, HTTP locally)
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express)                           │
│                     http://localhost:5000                        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Routes Layer                          │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐  │  │
│  │  │ /auth        │ │ /services    │ │ /bookings      │  │  │
│  │  │ (register)   │ │ (GET all)    │ │ (POST create)  │  │  │
│  │  │ (login)      │ │ (GET by id)  │ │ (GET mine)     │  │  │
│  │  │              │ │ (POST)       │ │ (PATCH cancel) │  │  │
│  │  │              │ │ (PUT)        │ │                │  │  │
│  │  │              │ │ (DELETE)     │ │                │  │  │
│  │  └──────────────┘ └──────────────┘ └────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────────┐ ┌──────────────┐                      │  │
│  │  │ /admin       │ │ /webhooks    │                      │  │
│  │  │ (dashboard)  │ │ (stripe)     │                      │  │
│  │  │ (manage)     │ │              │                      │  │
│  │  └──────────────┘ └──────────────┘                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↕                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Middleware Layer                         │  │
│  │  • JWT Verification (verify token)                       │  │
│  │  • Admin Check (verify admin role)                       │  │
│  │  • Request Validation (express-validator)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↕                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Models Layer (Business Logic)           │  │
│  │  ┌─────────────┐ ┌──────────────┐ ┌────────────────┐   │  │
│  │  │ User Model  │ │ Service      │ │ Booking Model  │   │  │
│  │  │ • CRUD      │ │ Model        │ │ • CRUD         │   │  │
│  │  │ • Hash pwd  │ │ • CRUD       │ │ • Track status │   │  │
│  │  │ • Verify    │ │              │ │ • Stripe link  │   │  │
│  │  └─────────────┘ └──────────────┘ └────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↕                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Config Layer                           │  │
│  │  • Database Pool (pg)                                    │  │
│  │  • Stripe SDK                                            │  │
│  │  • Nodemailer Configuration                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
          PostgreSQL Protocol (TCP/IP)
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                         │
│                    booking_platform                              │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ users    │  │ services │  │ bookings │  │ admin_users  │   │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────────┤   │
│  │ id       │  │ id       │  │ id       │  │ user_id (FK) │   │
│  │ email*   │  │ name     │  │ user_id* │  │ role         │   │
│  │ password │  │ desc     │  │ service* │  │ created_at   │   │
│  │ full_name│  │ price    │  │ date/time│  │              │   │
│  │ phone    │  │ image_url│  │ requests │  │ * References │   │
│  │ created  │  │ created  │  │ status   │  │   users(id)  │   │
│  │          │  │          │  │ stripe_id│  │              │   │
│  │          │  │          │  │ created  │  │              │   │
│  │*=unique  │  │*=indexes │  │*=FK, idx │  │              │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│                                                                   │
│  Indexes:                                                        │
│  • users(email) - for login lookups                            │
│  • bookings(user_id) - for user's bookings                     │
│  • bookings(service_id) - for service bookings                 │
│  • bookings(status) - for filtering by status                 │
│  • bookings(created_at) - for time-based queries              │
└─────────────────────────────────────────────────────────────────┘

External Services:
    ↓
┌─────────────────┐        ┌──────────────────┐
│ Stripe API      │        │ Gmail (SMTP)     │
│ • Payments      │        │ • Confirmations  │
│ • Webhooks      │        │ • Notifications  │
└─────────────────┘        └──────────────────┘
```

---

## 🔌 API Reference

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "full_name": "John Doe",
  "phone": "555-0123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "555-0123",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**
- 400: Invalid input
- 409: Email already exists

---

#### `POST /api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "555-0123",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**
- 401: Invalid credentials
- 404: User not found

---

### Services Endpoints

#### `GET /api/services`
Get all available services (public, no auth required).

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Home Cleaning",
    "description": "Professional home cleaning",
    "price": 75,
    "image_url": "https://..."
  },
  {
    "id": 2,
    "name": "Electrical Repair",
    "description": "Licensed electrician services",
    "price": 100,
    "image_url": "https://..."
  }
]
```

---

#### `GET /api/services/:id`
Get specific service details (public, no auth required).

**Response (200):**
```json
{
  "id": 1,
  "name": "Home Cleaning",
  "description": "Professional home cleaning",
  "price": 75,
  "image_url": "https://..."
}
```

**Errors:**
- 404: Service not found

---

#### `POST /api/services`
Create a new service (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Service",
  "description": "Service description",
  "price": 99.99,
  "image_url": "https://..."
}
```

**Response (201):**
```json
{
  "id": 9,
  "name": "New Service",
  "description": "Service description",
  "price": 99.99,
  "image_url": "https://...",
  "created_at": "2024-01-10T12:00:00Z"
}
```

**Errors:**
- 401: Not authenticated
- 403: Not admin
- 400: Invalid input

---

#### `PUT /api/services/:id`
Update a service (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "price": 89.99,
  "image_url": "https://..."
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Updated Name",
  "description": "Updated description",
  "price": 89.99,
  "image_url": "https://..."
}
```

---

#### `DELETE /api/services/:id`
Delete a service (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{ "message": "Service deleted" }
```

**Errors:**
- 404: Service not found
- 403: Not admin

---

### Bookings Endpoints

#### `POST /api/bookings/create-session`
Create a Stripe checkout session for a booking.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "service_id": 1,
  "booking_date": "2024-01-20",
  "booking_time": "14:00",
  "special_requests": "Extra cleaning for kitchen"
}
```

**Response (200):**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "sessionId": "cs_test_xxxxx"
}
```

**Errors:**
- 401: Not authenticated
- 404: Service not found
- 400: Invalid date/time

---

#### `GET /api/bookings`
Get user's bookings (authenticated users only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "service_name": "Home Cleaning",
    "service_price": 75,
    "booking_date": "2024-01-20",
    "booking_time": "14:00",
    "special_requests": "Extra cleaning",
    "status": "confirmed",
    "created_at": "2024-01-10T12:00:00Z"
  }
]
```

---

#### `PATCH /api/bookings/:id/cancel`
Cancel a booking (user can cancel own pending bookings).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "status": "cancelled",
  "message": "Booking cancelled successfully"
}
```

**Errors:**
- 404: Booking not found
- 403: Cannot cancel (wrong user or status)

---

### Admin Endpoints

#### `GET /api/admin/bookings`
Get all bookings (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_name": "John Doe",
    "service_name": "Home Cleaning",
    "service_price": 75,
    "booking_date": "2024-01-20",
    "booking_time": "14:00",
    "status": "pending"
  }
]
```

---

#### `PATCH /api/admin/bookings/:id/status`
Update booking status and send email notification (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Response (200):**
```json
{
  "id": 1,
  "status": "confirmed",
  "message": "Booking updated and email sent"
}
```

**Valid statuses:**
- `pending` - Initial status
- `confirmed` - Payment confirmed
- `cancelled` - Cancelled by user/admin
- `completed` - Service completed

---

#### `GET /api/admin/analytics`
Get dashboard analytics (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalBookings": 25,
  "confirmedBookings": 20,
  "pendingBookings": 3,
  "cancelledBookings": 2,
  "totalRevenue": 1850.50
}
```

---

### Webhook Endpoints

#### `POST /api/webhooks/stripe`
Stripe webhook for payment confirmation (Stripe sends this, not users).

**Headers:**
```
stripe-signature: t=<timestamp>,v1=<signature>
```

**Webhook Events Handled:**
- `checkout.session.completed` - Payment successful, update booking to "confirmed"

**Response (200):**
```json
{ "success": true }
```

**Errors:**
- 400: Invalid signature
- 500: Database error

---

## 🔐 Authentication

### JWT Token Format

All authenticated requests require:
```
Authorization: Bearer <token>
```

**Token Structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOjEsImlhdCI6MTcwNDg0NDAwMCwiZXhwIjoxNzA1NDQ4ODAwfQ.
signature
```

**Decoded Payload:**
```json
{
  "userId": 1,
  "iat": 1704844000,
  "exp": 1705448800
}
```

**Token Lifetime:** 7 days

### JWT Interceptor (Frontend)

Axios automatically includes the token:
```javascript
// In api.js - automatically added to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🔄 Data Flow Examples

### Complete Booking Flow

```
1. User browses /services (GET /api/services)
   ↓
2. Selects service and fills booking form
   ↓
3. Frontend calls POST /api/bookings/create-session
   ↓
4. Backend:
   - Creates booking record (status: pending)
   - Creates Stripe checkout session
   - Returns client secret + session ID
   ↓
5. Frontend loads Stripe embedded checkout
   ↓
6. User completes payment
   ↓
7. Stripe sends webhook to POST /api/webhooks/stripe
   ↓
8. Backend:
   - Validates webhook signature
   - Updates booking status to "confirmed"
   - Sends confirmation email
   ↓
9. Frontend redirects to /booking-success
   ↓
10. User can view booking in /bookings (GET /api/bookings)
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Authenticated but no permission |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Email already exists |
| 500 | Server Error - Something went wrong |

---

## 🧪 Testing with cURL

```bash
# Get all services (public)
curl http://localhost:5000/api/services

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone": "555-0000"
  }'

# Login (get token)
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.token')

# Get user's bookings (requires token)
curl http://localhost:5000/api/bookings \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📈 Performance Considerations

- Database indexes on frequently queried columns
- JWT token verification (no database lookup)
- Connection pooling for database
- Stripe SDK caching
- Email sending async (non-blocking)

---

## 🔒 Security Checklist

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT signature validation
- ✅ SQL prepared statements (prevent injection)
- ✅ Stripe webhook signature validation
- ✅ Request validation with express-validator
- ✅ CORS configured
- ✅ Environment variables for secrets
- ✅ Admin role checks on protected routes

