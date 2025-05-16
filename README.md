<h1 align="center">🎟️ Event-Booking System</h1>

Node + Express back-end & Next JS front-end in **one repo**.  
Users can browse / book events, while admins manage events & bookings.

---

## ✨ Features (quick list)

| Role           | Features                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Visitor        | • Multilingual events (EN ⇄ AR)<br/>• Search + price / category filters                                                                                      |
| Logged-in user | • Register / Login / Logout<br/>• Book & cancel own tickets<br/>• Profile page with booking history                                                          |
| Admin          | • Separate admin panel (`/admin`)<br/>• Create / delete events<br/>• View bookings for any event<br/>• Cancel any booking<br/>• **Admin cannot book** events |

---

## 🔐 Demo credentials

| Role  | Email                 | Password   |
| ----- | --------------------- | ---------- |
| Admin | **admin@example.com** | `Pass123!` |
| User  | **user1@example.com** | `Pass123!` |

_(Accounts are inserted automatically by the seed script.)_

---

## 🛠️ Local setup

```bash
git clone https://github.com/<you>/event-booking-system.git
cd event-booking-system
```

1 Install dependencies
BASH

# installs both backend and frontend

npm run install-all
(root package.json contains that helper script:
"install-all": "npm --prefix backend i && npm --prefix frontend i")

2 Environment variables
Create the following files:

backend/.env

ENV

MONGODB_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=supersecret
PORT=4000
frontend/.env.local

ENV

NEXT_PUBLIC_API_BASE=http://localhost:4000/api
3 ( Optional ) Seed the database with demo data
BASH

npm run seed # runs backend/scripts/seed.js
4 Start both servers
BASH

npm run dev # concurrently runs back-end on :4000 and front-end on :3000
Open http://localhost:3000 in your browser.
Admin panel lives at /admin (visible only when logged in as admin).

🧩 Stack
Front-end – Next JS 13/14 (App router) + TailwindCSS
Back-end – Node, Express, MongoDB (Mongoose)
Auth – JWT stored in HTTP-only cookie
File upload – Multer
Validation – Zod
Dummy data – Faker.js (npm run seed)
