/**
 * Seed script — Event-Booking System
 * ----------------------------------
 * 1. Creates admin + 10 users
 * 2. Creates 20 bilingual events
 * 3. Creates random bookings that honour ticket counts
 *
 * Run:  npm run seed
 */

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

import User from "../user/user.model.js";
import Event from "../event/event.model.js";
import Booking from "../booking/booking.model.js";

/* ───── Tunables ───── */
const NUM_USERS = 10;
const NUM_EVENTS = 20;
const MAX_BOOKINGS_PER_USER = 4;
const PASSWORD_PLAIN = "Pass123!";
/* ──────────────────── */

/* ---------- Arabic placeholder ---------- */
const AR_PLACEHOLDER = "هذا نص عربي افتراضي";
const toArabic = async () => AR_PLACEHOLDER;

/* ---------- Category / tag pool ---------- */
const CATEGORIES = [
  { en: "Music", ar: "موسيقى", tag: { en: "Concert", ar: "حفلة" } },
  { en: "Sports", ar: "رياضة", tag: { en: "Match", ar: "مباراة" } },
  { en: "Tech", ar: "تقنية", tag: { en: "Expo", ar: "معرض" } },
  { en: "Business", ar: "أعمال", tag: { en: "Startup", ar: "شركة" } },
  { en: "Art", ar: "فن", tag: { en: "Gallery", ar: "معرض" } },
  { en: "Health", ar: "صحة", tag: { en: "Wellness", ar: "عافية" } },
  { en: "Comedy", ar: "كوميديا", tag: { en: "Stand-up", ar: "ستاند أب" } },
];

/* ---------- Helpers ---------- */
const makeEnglishDescription = () =>
  [faker.commerce.productDescription(), faker.company.catchPhrase()].join(" ");

const connectDB = () => mongoose.connect(process.env.MONGODB_URI);
const wipeDB = () =>
  Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Booking.deleteMany({}),
  ]);

/* ---------- Seed steps ---------- */
const createUsers = async () => {
  const hash = await bcrypt.hash(PASSWORD_PLAIN, 12);

  const admin = await User.create({
    username: "admin",
    email: "admin@example.com",
    password: hash,
    role: "admin",
    status: "Online",
  });

  const users = Array.from({ length: NUM_USERS }).map(() => ({
    username: faker.internet.userName().toLowerCase(),
    email: faker.internet.email().toLowerCase(),
    password: hash,
    status: "Online",
  }));

  const docs = await User.insertMany(users);
  console.log(`👤  Users: ${docs.length + 1} (incl. admin)`);
  return { admin, users: docs };
};

const createEvents = async (adminId) => {
  const events = [];

  for (let i = 0; i < NUM_EVENTS; i++) {
    const titleEn = faker.company.catchPhrase();
    const descEn = makeEnglishDescription();

    const {
      en: catEn,
      ar: catAr,
      tag,
    } = faker.helpers.arrayElement(CATEGORIES);

    const total = faker.number.int({ min: 50, max: 300 });
    const sold = faker.number.int({ min: 0, max: total });

    events.push({
      title: { en: titleEn, ar: await toArabic() },
      description: { en: descEn, ar: await toArabic() },
      category: { en: catEn, ar: catAr },
      venue: {
        en: faker.location.city(),
        ar: await toArabic(),
      },
      tags: [tag],

      eventDate: faker.date.future(),
      price: faker.number.int({ min: 0, max: 200 }),
      imageUrl: faker.image.urlPicsumPhotos(),

      totalTickets: total,
      ticketsSold: sold,
      ticketsAvailable: total - sold,

      createdBy: adminId,
    });
  }

  const docs = await Event.insertMany(events);
  console.log(`🎪  Events: ${docs.length}`);
  return docs;
};

const createBookings = async (users, events) => {
  const bookings = [];

  users.forEach((u) => {
    const count = faker.number.int({ min: 1, max: MAX_BOOKINGS_PER_USER });
    const picks = faker.helpers.shuffle(events).slice(0, count);

    picks.forEach((ev) => {
      if (ev.ticketsAvailable < 1) return;

      bookings.push({
        user: u._id,
        event: ev._id,
        qty: 1,
        totalPrice: ev.price,
        status: "confirmed",
      });

      ev.ticketsSold += 1;
      ev.ticketsAvailable -= 1;
    });
  });

  await Booking.insertMany(bookings);
  await Promise.all(events.map((e) => e.save()));
  console.log(`📑  Bookings: ${bookings.length}`);
};

/* ---------- Main ---------- */
const main = async () => {
  try {
    await connectDB();
    console.log("✅  Mongo connected");

    await wipeDB();

    const { admin, users } = await createUsers();
    const events = await createEvents(admin._id);
    await createBookings(users, events);

    console.log("🌱  Seed done. Admin password:", PASSWORD_PLAIN);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

main();
