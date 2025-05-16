import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import User from "./user.model.js";

class UserService {
  async getUserById(id) {
    id = mongoose.Types.ObjectId.createFromHexString(id);
    const user = await User.findById(id);
    if (!user) throw new AppError("User not found");
    return user;
  }

  async deleteUserById(user, id) {
    if (user.role !== "admin" && user._id.toString() !== id.toString())
      throw new AppError("Not authorized to delete user", 401);

    await User.findByIdAndDelete(
      mongoose.Types.ObjectId.createFromHexString(id)
    );
    return "User deleted successfully";
  }

  async searchUsers(user, query) {
    const blockedUsersDoc = await User.findById(user._id).select(
      "blockedUsers"
    );
    const blockedUsers = blockedUsersDoc?.blockedUsers || [];

    const usersWhoBlockedMeDoc = await User.find({
      blockedUsers: user._id,
    }).select("_id");
    const usersWhoBlockedMe = usersWhoBlockedMeDoc.map((user) => user._id);

    const users = await User.find({
      username: { $regex: `^${query}`, $options: "i" },
      _id: { $not: { $in: [...usersWhoBlockedMe, ...blockedUsers] } },
    }).select("-password");

    return users;
  }

  async blockUser(user, id) {
    id = mongoose.Types.ObjectId.createFromHexString(id);
    const isBlocked = await User.findOne({ _id: user._id, blockedUsers: id });
    if (isBlocked) throw new AppError("User is already blocked", 400);

    await User.findByIdAndUpdate(user._id, { $push: { blockedUsers: id } });
    return "User blocked successfully";
  }

  async unblockUser(user, id) {
    id = mongoose.Types.ObjectId.createFromHexString(id);
    const isBlocked = await User.findOne({ _id: user._id, blockedUsers: id });
    if (!isBlocked) throw new AppError("User is not blocked", 400);

    await User.findByIdAndUpdate(user._id, { $pull: { blockedUsers: id } });
    return "User unblocked successfully";
  }
}

export default new UserService();
