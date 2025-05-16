import AsyncWrapper from "../utils/AsyncWraper.js";
import userService from "./user.service.js";

class UserController {
  getUserById = AsyncWrapper(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ data: user });
  });

  deleteUserById = AsyncWrapper(async (req, res) => {
    const message = await userService.deleteUserById(req.user, req.params.id);
    res.status(200).json({ data: message });
  });

  searchUsers = AsyncWrapper(async (req, res) => {
    const users = await userService.searchUsers(req.user, req.query.query);
    res.status(200).json({ data: users });
  });

  blockUser = AsyncWrapper(async (req, res) => {
    const message = await userService.blockUser(req.user, req.params.id);
    res.status(200).json({ data: message });
  });

  unblockUser = AsyncWrapper(async (req, res) => {
    const message = await userService.unblockUser(req.user, req.params.id);
    res.status(200).json({ data: message });
  });
}

export default new UserController();
