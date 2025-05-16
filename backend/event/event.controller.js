import AsyncWrapper from "../utils/AsyncWraper.js";
import eventService from "./event.service.js";

class EventController {
  listEvents = AsyncWrapper(async (req, res) => {
    const langHeader = req.headers["accept-language"] || "en";
    const lang = langHeader.includes("ar") ? "ar" : "en";

    const result = await eventService.listEvents(req.query, lang);
    res.status(200).json({ data: result.data, pagination: result.pagination });
  });

  getEventById = AsyncWrapper(async (req, res) => {
    const langHeader = req.headers["accept-language"] || "en";
    const lang = langHeader.includes("ar") ? "ar" : "en";

    const event = await eventService.getEventById(req.params.id, lang);
    res.status(200).json({ data: event });
  });

  createEvent = AsyncWrapper(async (req, res) => {
    if (req.file) req.body.imageUrl = `/uploads/${req.file.filename}`;

    const event = await eventService.createEvent(req.user, req.body);
    res.status(201).json({ data: event });
  });

  deleteEvent = AsyncWrapper(async (req, res) => {
    const message = await eventService.deleteEvent(req.user, req.params.id);
    res.status(200).json({ data: message });
  });

  getEventBookings = AsyncWrapper(async (req, res) => {
    const result = await eventService.listEventBookings(
      req.user,
      req.params.id,
      req.query
    );
    res.status(200).json({ data: result.data, pagination: result.pagination });
  });
}

export default new EventController();
