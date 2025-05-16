<h1 align="center">🎟️ Event-Booking System</h1>
<p align="center">
  <b>Monorepo · Express API + Next JS front-end</b><br/>
  Users browse & book events — Admins manage everything.
</p>

---

## ✨ Features

|
Role  
|
Highlights  
|
|

---

## |

|
|
Visitor  
|
Multilingual events (EN ⇆ AR)
&nbsp;
·
&nbsp;
Search + price / category filters  
|
|
User  
|
Sign-up / Login / Logout · Book & cancel own tickets · Profile page with booking history  
|
|
Admin  
|
**
Admin panel
**
(
`/admin`
) · Create / delete events · View bookings for any event · Cancel any booking ·
<
u

> No booking
> </
> u
>
> for admin
> |

---

## 🔐 Demo credentials (seed data)

|
Role  
|
Email  
|
Password
|
|

---

## |

## |

|
|
Admin
|
**
admin@example.com
**
|
`Pass123!`
|
|
User  
|
**
user1@example.com
**
|
`Pass123!`
|

> Accounts are inserted automatically by `seed.js`.

---

## 🛠️ Local setup

```bash
git clone https://github.com/<you>/event-booking-system.git
cd event-booking-system
1 Install dependencies
BASH

# Back-end
cd backend
npm install
cd ..

# Front-end
cd frontend
npm install
cd ..
2 Environment variables
backend/.env

ENV

MONGODB_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=supersecret
PORT=4000
frontend/.env.local

ENV

NEXT_PUBLIC_API_BASE=http://localhost:4000/api
3 Seed the database (Optional)
BASH

node backend/scripts/seed.js   # inserts admin, users, events, bookings
4 Run servers
BASH

# ── Terminal 1  (back-end)
cd backend
npm start                     # → http://localhost:4000

# ── Terminal 2  (front-end)
cd frontend
npm run dev                   # → http://localhost:3000
Open http://localhost:3000 in your browser.
Admin panel is available at /admin (visible only when logged-in as admin).

🧩 Tech stack
Layer	Tech
Front-end	Next JS 13/14 (App Router), Tailwind CSS
Back-end	Node, Express, MongoDB (Mongoose)
Auth	JWT stored in HTTP-only cookie
File upload	Multer
Validation	Zod
Dummy data	Faker.js (seed.js)
```
