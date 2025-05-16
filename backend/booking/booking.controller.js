import AsyncWrapper from "../utils/AsyncWraper.js";
import bookingService from "./booking.service.js";

class BookingController {
  createBooking = AsyncWrapper(async (req, res) => {
    const booking = await bookingService.createBooking(req.user, req.body);
    res.status(201).json({ data: booking });
  });

  listMyBookings = AsyncWrapper(async (req, res) => {
    const langHeader = req.headers["accept-language"] || "en";
    const lang = langHeader.includes("ar") ? "ar" : "en";

    const result = await bookingService.listUserBookings(
      req.user,
      req.query,
      lang
    );

    res.status(200).json({ data: result.data, pagination: result.pagination });
  });

  cancelBooking = AsyncWrapper(async (req, res) => {
    const message = await bookingService.cancelBooking(req.user, req.params.id);
    res.status(200).json({ data: message });
  });
}

export default new BookingController();
