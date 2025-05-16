import { Router } from "express";
import authController from "../auth/auth.controller.js";
import bookingController from "./booking.controller.js";

const bookingRouter = Router();

bookingRouter.get(
  "/",
  authController.authorize,
  bookingController.listMyBookings
);

bookingRouter.post(
  "/",
  authController.authorize,
  bookingController.createBooking
);

bookingRouter.delete(
  "/:id",
  authController.authorize,
  bookingController.cancelBooking
);

export default bookingRouter;
