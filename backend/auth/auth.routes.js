import { Router } from "express";
import authController from "./auth.controller.js";
import uploadSingleFile from "../file/file.controller.js";

const authRouter = Router();

authRouter.post("/signup", uploadSingleFile, authController.signup);

authRouter.post("/login", authController.login);

authRouter.post("/logout", authController.logout);

export default authRouter;
