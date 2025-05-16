import { Router } from "express";
import eventController from "./event.controller.js";
import authController from "../auth/auth.controller.js";
import uploadSingleFile from "../file/file.controller.js";

const eventRouter = Router();

eventRouter.get("/", eventController.listEvents);

eventRouter.get(
  "/:id/bookings",
  authController.authorize,
  eventController.getEventBookings
);

eventRouter.get("/:id", eventController.getEventById);

eventRouter.post(
  "/",
  authController.authorize,
  uploadSingleFile,
  eventController.createEvent
);

eventRouter.delete(
  "/:id",
  authController.authorize,
  eventController.deleteEvent
);

export default eventRouter;
