/**
 * Seed script — Event-Booking System
 * ----------------------------------
 * 1.  Creates admin + normal users
 * 2.  Creates bilingual events with realistic data
 * 3.  Creates random bookings that respect ticket counts
 *
 * Run:  npm run seed           (package.json => "seed": "node scripts/seed.js")
 */

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import translate from "@vitalets/google-translate-api";
import pLimit from "p-limit";

import User from "../user/user.model.js";
import Event from "../event/event.model.js";
import Booking from "../booking/booking.model.js";

/* ─────────── Tunables ─────────── */
const NUM_USERS = 10;
const NUM_EVENTS = 20;
const MAX_BOOKINGS_PER_USER = 4;
const PASSWORD_PLAIN = "Pass123!";
/* ──────────────────────────────── */

/* ---------- Translation helpers ---------- */
const limit = pLimit(5); // max 5 concurrent HTTP requests

const googleTranslate = (txt) =>
  limit(
    () => translate(txt, { to: "ar", client: "gtx" }) // 'gtx' avoids quota errors
  );

const toArabic = async (text) => {
  const clean = text.replace(/\n/g, " ").trim();
  try {
    const { text: ar } = await googleTranslate(clean);
    return ar;
  } catch {
    /* fallback: translate sentence-by-sentence */
    try {
      const sentences = clean.split(/\. +/).filter(Boolean);
      const translated = [];
      for (const s of sentences) {
        const { text: arPart } = await googleTranslate(s);
        translated.push(arPart);
      }
      return translated.join(". ");
    } catch {
      console.warn("⚠️  Translate failed, using fallback.");
      return "AR_" + clean;
    }
  }
};

/* ---------- Realistic categories ---------- */
const CATEGORIES = [
  { en: "Music", ar: "موسيقى", tag: { en: "Concert", ar: "حفلة" } },
  { en: "Sports", ar: "رياضة", tag: { en: "Match", ar: "مباراة" } },
  { en: "Technology", ar: "تقنية", tag: { en: "Tech", ar: "تقنية" } },
  { en: "Business", ar: "أعمال", tag: { en: "Startup", ar: "شركة ناشئة" } },
  { en: "Art", ar: "فن", tag: { en: "Gallery", ar: "معرض" } },
  { en: "Education", ar: "تعليم", tag: { en: "Workshop", ar: "ورشة" } },
  { en: "Health", ar: "صحة", tag: { en: "Wellness", ar: "عافية" } },
  { en: "Comedy", ar: "كوميديا", tag: { en: "Stand-up", ar: "ستاند أب" } },
  { en: "Travel", ar: "سفر", tag: { en: "Expo", ar: "معرض" } },
];

/* ---------- Description builder ---------- */
const makeEnglishDescription = () =>
  [
    faker.commerce.productDescription(), // real marketing line
    faker.company.catchPhrase(), // catchy phrase
  ].join(" ");

/* ---------- DB helpers ---------- */
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
    username: faker.internet.username().toLowerCase(),
    email: faker.internet.email().toLowerCase(),
    password: hash,
    status: "Online",
  }));

  const userDocs = await User.insertMany(users);
  console.log(`👤  Users: ${userDocs.length + 1} (incl. admin)`);
  return { admin, users: userDocs };
};

const createEvents = async (adminId) => {
  const events = [];

  for (let i = 0; i < NUM_EVENTS; i++) {
    const titleEn = faker.company.catchPhrase();
    const descriptionEn = makeEnglishDescription();

    const [titleAr, descriptionAr] = await Promise.all([
      toArabic(titleEn),
      toArabic(descriptionEn),
    ]);

    const {
      en: catEn,
      ar: catAr,
      tag,
    } = faker.helpers.arrayElement(CATEGORIES);

    const total = faker.number.int({ min: 50, max: 300 });
    const sold = faker.number.int({ min: 0, max: total });

    events.push({
      title: { en: titleEn, ar: titleAr },
      description: { en: descriptionEn, ar: descriptionAr },
      category: { en: catEn, ar: catAr },
      venue: {
        en: faker.location.city(),
        ar: await toArabic(faker.location.city()),
      },
      tags: [tag],

      eventDate: faker.date.future(),
      price: faker.number.int({ min: 0, max: 250 }),
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

  users.forEach((user) => {
    const count = faker.number.int({ min: 1, max: MAX_BOOKINGS_PER_USER });
    const choices = faker.helpers.shuffle(events).slice(0, count);

    choices.forEach((event) => {
      if (event.ticketsAvailable < 1) return;

      bookings.push({
        user: user._id,
        event: event._id,
        quantity: 1,
        status: "confirmed",
      });

      event.ticketsSold += 1;
      event.ticketsAvailable -= 1;
    });
  });

  await Booking.insertMany(bookings);
  await Promise.all(events.map((e) => e.save()));
  console.log(`📑  Bookings: ${bookings.length}`);
};

/* ---------- Main runner ---------- */
const main = async () => {
  try {
    await connectDB();
    console.log("✅  Mongo connected");

    await wipeDB();

    const { admin, users } = await createUsers();
    const events = await createEvents(admin._id);
    await createBookings(users, events);

    console.log("🌱  Seeding finished. Admin password:", PASSWORD_PLAIN);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

main();
