import { Router } from "express";
import userController from "./user.controller.js";
import authController from "../auth/auth.controller.js";

const userRouter = Router();

userRouter.get("/:id", authController.authorize, userController.getUserById);

userRouter.delete(
  "/:id",
  authController.authorize,
  userController.deleteUserById
);

userRouter.get("/search", authController.authorize, userController.searchUsers);

userRouter.patch(
  "/block/:id",
  authController.authorize,
  userController.blockUser
);

userRouter.patch(
  "/unblock/:id",
  authController.authorize,
  userController.unblockUser
);

export default userRouter;
