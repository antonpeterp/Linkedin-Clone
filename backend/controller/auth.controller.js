import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export const initPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_PWD,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            user = await User.create({
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              userName: profile.emails[0].value.split("@")[0] + Date.now(),
              email: profile.emails[0].value,
              password: await bcrypt.hash(Math.random().toString(36), 10),
              profileImage: profile.photos[0]?.value || "",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};

const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  secure: process.env.NODE_ENV === "production",
};

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = await genToken(user._id);
    res.cookie("token", token, cookieOptions);
    res.redirect(process.env.CLIENT_URL);
  } catch (err) {
    console.log(err);
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};

export const signUp = async (req, res) => {
  try {
    let { firstName, lastName, userName, email, password } = req.body;

    let existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let existUsername = await User.findOne({ userName });
    if (existUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });
    let token = await genToken(user._id);
    res.cookie("token", token, cookieOptions);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Signup Error" });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    let token = await genToken(user._id);
    res.cookie("token", token, cookieOptions);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Login Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Log Out successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Logout Error" });
  }
};
