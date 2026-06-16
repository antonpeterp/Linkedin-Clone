import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    let id = req.userId;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Get Current User Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let { firstName, lastName, userName, headline, location, gender } =
      req.body;
    let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    let education = req.body.education ? JSON.parse(req.body.education) : [];
    let experience = req.body.experience ? JSON.parse(req.body.experience) : [];
    let profileImage;
    let coverImage;

    if (req.files?.profileImage) {
      profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
    }
    if (req.files?.coverImage) {
      coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
    }
    let user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        userName,
        headline,
        location,
        gender,
        skills,
        education,
        experience,
        ...(profileImage && { profileImage: profileImage.secure_url }),
        ...(coverImage && { coverImage: coverImage.secure_url }),
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Update Profile Error" });
  }
};
export const toggleConnect = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.userId;

    if (targetUserId === currentUserId) {
      return res
        .status(400)
        .json({ message: "You can't connect with yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const alreadyConnected = currentUser.connection.includes(targetUserId);

    if (alreadyConnected) {
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { connection: targetUserId },
      });
    } else {
      await User.findByIdAndUpdate(currentUserId, {
        $push: { connection: targetUserId },
      });
    }

    const updatedUser = await User.findById(currentUserId);
    return res.status(200).json({ connection: updatedUser.connection });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);

    // get all users except current user and already connected users
    const users = await User.find({
      _id: { $ne: req.userId, $nin: currentUser.connection },
    })
      .select("-password")
      .limit(5);

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .populate("connection", "firstName lastName profileImage headline");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Get User Error" });
  }
};
