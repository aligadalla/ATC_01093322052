import mongoose from "mongoose";
import Booking from "./booking.model.js";
import Event from "../event/event.model.js";
import mapToLanguage from "../utils/mapToLanguage.js";
import AppError from "../utils/AppError.js";

class BookingService {
  async createBooking(user, payload) {
    const { eventId, qty } = payload;

    if (!mongoose.Types.ObjectId.isValid(eventId))
      throw new AppError("Invalid event id", 400);

    const quantity = parseInt(qty);
    if (!quantity || quantity <= 0)
      throw new AppError("qty must be a positive integer", 400);

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const event = await Event.findOneAndUpdate(
        {
          _id: eventId,
          ticketsAvailable: { $gte: quantity },
        },
        {
          $inc: { ticketsSold: quantity, ticketsAvailable: -quantity },
        },
        { new: true, session }
      );

      if (!event)
        throw new AppError("Not enough tickets available for this event", 400);

      const totalPrice = event.price * quantity;

      const [booking] = await Booking.create(
        [
          {
            event: eventId,
            user: user._id,
            qty: quantity,
            totalPrice,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return booking.toObject();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      if (err instanceof AppError) throw err;
      throw new AppError("Failed to create booking", 500);
    }
  }

  async listUserBookings(user, query, lang = "en") {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(parseInt(query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = { user: user._id };

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("event")
        .lean(),
      Booking.countDocuments(filter),
    ]);

    const mapped = bookings.map((b) => ({
      ...b,
      event: b.event ? mapToLanguage(b.event, lang) : b.event,
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

  async cancelBooking(user, bookingId) {
    if (!mongoose.Types.ObjectId.isValid(bookingId))
      throw new AppError("Invalid booking id", 400);

    const booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError("Booking not found", 404);

    const isOwner = booking.user.toString() === user._id.toString();
    if (user.role !== "admin" && !isOwner)
      throw new AppError("Not authorized to cancel this booking", 403);

    if (booking.status === "cancelled")
      throw new AppError("Booking already cancelled", 400);

    booking.status = "cancelled";
    await booking.save();

    const qty = Number(booking.qty) || 0;
    if (qty > 0) {
      await Event.updateOne(
        { _id: booking.event },
        {
          $inc: {
            ticketsSold: -qty,
            ticketsAvailable: qty,
          },
        }
      );
    }

    return "Booking cancelled successfully";
  }
}

export default new BookingService();
