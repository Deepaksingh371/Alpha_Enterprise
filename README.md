# Alpha Enterprise Solution Pvt Ltd — Company Website

A lightweight, production-ready showcase website for a hardware startup, with a simple admin
panel for managing products and enquiries. No user accounts, no cart, no checkout — just a
product catalog and a mandatory enquiry form that feeds a private admin dashboard.

## Tech Stack

- **Frontend:** React 18 (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)
- **Image storage:** Cloudinary
- **Auth:** JWT (single admin account, no public registration)
- **Email:** Nodemailer (SMTP) — notifies admin on new enquiries

## Project Structure

```
hardware-startup-website/
├── backend/
│   ├── config/          # MongoDB + Cloudinary connections
│   ├── models/          # Admin, Product, Enquiry (Mongoose schemas)
│   ├── routes/          # auth, products, enquiries, dashboard
│   ├── middleware/      # JWT auth guard, error handler
│   ├── utils/           # email notifications, admin seed script
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, Footer, ProductCard, EnquiryModal, ProductModal…
    │   ├── pages/        # Home, Products, ProductDetails, Contact
    │   │   └── admin/    # AdminLogin, AdminLayout, AdminDashboard, AdminProducts, AdminEnquiries
    │   ├── context/      # AuthContext (admin session)
    │   ├── api/          # axios instance with JWT interceptor
    │   └── App.jsx
    ├── tailwind.config.js
    └── .env.example
```

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A MongoDB database (local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A free [Cloudinary](https://cloudinary.com) account (for product image storage)
- (Optional) An SMTP account for email notifications — e.g. a Gmail account with an
  [app password](https://myaccount.google.com/apppasswords)

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in:

- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard
- `SMTP_*` and `ADMIN_NOTIFY_EMAIL` — optional; if left blank, the app simply skips sending emails
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the first admin account's credentials (used only once, by the seed script)

Create your admin account (run once):

```bash
npm run seed
```

Start the API:

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`VITE_API_URL` defaults to `http://localhost:5000/api`, which matches the backend above.

Start the dev server:

```bash
npm run dev
# Site runs on http://localhost:5173
```

Visit `http://localhost:5173` for the public site, and `http://localhost:5173/admin/login`
to sign in with the admin account you seeded.

### 4. Add your first products

Log in to the admin panel → **Products** → **Add Product**. Fill in the name, category,
description, specifications (key/value rows) and upload one or more images — they upload
straight to Cloudinary. Set status to **Active** to make it visible on the public site.

## How the enquiry flow works

1. A visitor clicks **Enquire Now** on any product (from the catalog, quick view, or product
   detail page).
2. A form opens with Full Name, Email, Phone and Company Name required, Message optional, and
   Product Name auto-filled.
3. On submit, the enquiry is saved to MongoDB and an email notification is sent to
   `ADMIN_NOTIFY_EMAIL` (if SMTP is configured).
4. The visitor sees a success confirmation in the modal.
5. The enquiry appears immediately in **Admin → Enquiries**, where it can be searched, filtered
   by status, viewed in full, have its status updated (New / Contacted / Closed), or deleted.

## API Overview

| Method | Endpoint                        | Access  | Description                          |
|--------|----------------------------------|---------|---------------------------------------|
| POST   | `/api/auth/login`               | Public  | Admin login, returns JWT              |
| GET    | `/api/auth/me`                  | Private | Current admin info                    |
| GET    | `/api/products`                 | Public  | List active products (search/filter)  |
| GET    | `/api/products/featured`        | Public  | Featured products for homepage        |
| GET    | `/api/products/:id`             | Public  | Single active product                 |
| GET    | `/api/products/admin/all`       | Private | List all products (incl. inactive)    |
| POST   | `/api/products`                 | Private | Create product + upload images        |
| PUT    | `/api/products/:id`             | Private | Update product, add/remove images     |
| DELETE | `/api/products/:id`             | Private | Delete product + its Cloudinary images|
| POST   | `/api/enquiries`                | Public  | Submit an enquiry                     |
| GET    | `/api/enquiries`                | Private | List enquiries (search/filter)        |
| PUT    | `/api/enquiries/:id`            | Private | Update enquiry status                 |
| DELETE | `/api/enquiries/:id`            | Private | Delete enquiry                        |
| GET    | `/api/dashboard/stats`          | Private | Dashboard counts + recents            |

## Deployment notes

- **Backend:** deploy to any Node host (Render, Railway, Fly.io, a VPS, etc.). Set the same
  environment variables as `.env.example`, using your production MongoDB URI and `CLIENT_URL`
  set to your deployed frontend's URL (for CORS).
- **Frontend:** `npm run build` produces a static `dist/` folder — deploy to Vercel, Netlify,
  or any static host. Set `VITE_API_URL` to your deployed backend's `/api` URL at build time.
- Rotate `JWT_SECRET` and the seeded admin password before going to production.

## What's intentionally not included

Per the project brief, this is a showcase + enquiry site, not an e-commerce platform:
no customer accounts, no cart, no checkout, no payments, no order tracking, no wishlist.
