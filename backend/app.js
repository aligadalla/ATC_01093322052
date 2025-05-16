import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";

import authRouter from "./auth/auth.routes.js";
import userRouter from "./user/user.routes.js";
import eventRouter from "./event/event.routes.js";
import bookingRouter from "./booking/booking.routes.js";
import errorMiddleware from "./utils/errorMiddleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/events", eventRouter);
app.use("/bookings", bookingRouter);
app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
});
