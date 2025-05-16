import Event from "./event.model.js";
import Booking from "../booking/booking.model.js";
import AppError from "../utils/AppError.js";
import mapToLanguage from "../utils/mapToLanguage.js";
import buildFilter from "../utils/buildFilter.js";
import mongoose from "mongoose";

class EventService {
  async listEvents(query, lang = "en") {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(parseInt(query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = buildFilter(query);

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ eventDate: 1 }).skip(skip).limit(limit).lean(),
      Event.countDocuments(filter),
    ]);

    const mapped = events.map((e) => ({
      ...e,
      title: e.title?.[lang] ?? e.title.en,
      description: e.description?.[lang] ?? e.description.en,
      category: e.category?.[lang] ?? e.category.en,
      venue: e.venue?.[lang] ?? e.venue.en,
      tags: e.tags?.map((t) => t[lang] ?? t.en),
    }));

    return {
      data: mapped,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEventById(id, lang = "en") {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new AppError("Invalid event id", 400);

    const event = await Event.findById(id).lean();
    if (!event) throw new AppError("Event not found", 404);

    return mapToLanguage(event, lang);
  }

  async createEvent(user, payload) {
    if (user.role !== "admin")
      throw new AppError("Only admins can create events", 403);

    const required = ["title", "description", "venue"];
    for (const key of required) {
      if (!payload[key]?.en || !payload[key]?.ar)
        throw new AppError(`${key} must have both en and ar`, 400);
    }

    if (payload.totalTickets && payload.ticketsAvailable == null) {
      payload.ticketsAvailable = payload.totalTickets;
      payload.ticketsSold = 0;
    }

    const event = await Event.create({ ...payload, createdBy: user._id });
    return event.toObject();
  }

  async deleteEvent(user, id) {
    if (user.role !== "admin")
      throw new AppError("Only admins can delete events", 403);

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new AppError("Invalid event id", 400);

    const event = await Event.findById(id);
    if (!event) throw new AppError("Event not found", 404);

    await Event.deleteOne({ _id: id });

    await Booking.deleteMany({ event: id });

    return "Event deleted successfully";
  }

  async listEventBookings(user, eventId, query) {
    if (user.role !== "admin")
      throw new AppError("Only admins can view bookings for an event", 403);

    if (!mongoose.Types.ObjectId.isValid(eventId))
      throw new AppError("Invalid event id", 400);

    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) throw new AppError("Event not found", 404);

    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(parseInt(query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = { event: eventId };

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("user", "username email role")
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    return {
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default new EventService();
