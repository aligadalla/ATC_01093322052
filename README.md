<h1 align="center">🎟️ Event-Booking System</h1>
<p align="center">
  <b>Monorepo · Express API + Next JS front-end</b><br/>
  Users browse & book events — Admins manage everything.
</p>

---

## ✨ Features

| Role    | Highlights                                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Visitor | Multilingual events (EN ⇆ AR) &nbsp;·&nbsp; Search + price / category filters                                                        |
| User    | Sign-up / Login / Logout · Book & cancel own tickets · Profile page with booking history                                             |
| Admin   | **Admin panel** (`/admin`) · Create / delete events · View bookings for any event · Cancel any booking · <u>No booking</u> for admin |

---

## 🔐 Demo credentials (seed data)

| Role  | Email                 | Password   |
| ----- | --------------------- | ---------- |
| Admin | **admin@example.com** | `Pass123!` |
| User  | **user1@example.com** | `Pass123!` |

> Accounts are inserted automatically by `seed.js`.

---

## 🛠️ Local setup

```bash
git clone https://github.com/<you>/event-booking-system.git
cd event-booking-system
```

## 1. Install Dependencies

```bash
# Back-end
cd backend
npm install
cd ..

# Front-end
cd frontend
npm install
cd ..
```

## 2. Environment variables

`backend/.env`

```bash
MONGODB_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=supersecret
```

## 3. Seed the database (Optional)

```bash
node backend/scripts/seed.js # inserts admin, users, events, bookings
```

## 4. Run Servers

```bash
# ── Terminal 1  (back-end)
cd backend
npm start                     # → http://localhost:4000

# ── Terminal 2  (front-end)
cd frontend
npm run dev                   # → http://localhost:3000
```

---

## 🚀 Launch locally

• Start both servers (see “Local setup” above).  
• Open **http://localhost:3000** in your browser.  
• Admin dashboard: **/admin**  
 (visible only after logging in with an admin account).

---

## 🧩 Tech&nbsp;stack

| Layer       | Tech                                              |
| ----------- | ------------------------------------------------- |
| Front-end   | **Next JS 13/14** (App Router) · **Tailwind CSS** |
| Back-end    | **Node.js**, **Express**, **MongoDB** (Mongoose)  |
| Auth        | **JWT** stored in an **HTTP-only cookie**         |
| File upload | **Multer** (multipart/form-data)                  |
| Validation  | **Zod**                                           |
| Dummy data  | **Faker.js** (`backend/scripts/seed.js`)          |

---
