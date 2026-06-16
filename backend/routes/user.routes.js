import express from "express";
import {
  getCurrentUser,
  updateProfile,
  toggleConnect,
  getSuggestedUsers,
  getUserById,
} from "../controller/user.controllers.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

let userRouter = express.Router();
userRouter.get("/currentuser", isAuth, getCurrentUser);
userRouter.put(
  "/updateprofile",
  isAuth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateProfile
);
userRouter.post("/connect/:userId", isAuth, toggleConnect);
userRouter.get("/suggested", isAuth, getSuggestedUsers);
userRouter.get("/profile/:userId", isAuth, getUserById);

export default userRouter;
