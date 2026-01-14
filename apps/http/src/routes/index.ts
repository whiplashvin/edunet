import express from "express";
import { db } from "@repo/db/db";
import jwt from "jsonwebtoken";
import { sessionRoute } from "./session";
import { userMiddleware } from "../middleware/user";
import { SignupCreds, SigninCreds } from "@repo/validators/index";
import bcrypt from "bcryptjs";
import { getGoogleOAuthToken, getGoogleUserDetails } from "../../utils/utils";
import { Prisma } from "@prisma/client";

require("dotenv").config();

const route = express.Router();

route.use("/session", sessionRoute);

route.get("/health", (req, res) => {
  res.status(200).json({ message: "Healthy server. Edunet API running." });
});

route.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  const validCreds = SignupCreds.safeParse({ username, password, email });

  if (!validCreds.success) {
    res.status(400).json({ message: "Invalid credentials." });
    return;
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log(hashedPassword);
  try {
    const newUser = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: "user",
      },
    });

    res.status(200).json({
      message: "User created successfully",
      userId: newUser.id,
      email: newUser.email,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const target = err.meta?.target;
      if (target && Array.isArray(target) && target.length > 0) {
        const fieldName = target[0] as string;
        if (fieldName === "username") {
          return res.status(409).json({ message: "Username already taken" });
        } else if (fieldName === "email") {
          return res.status(409).json({ message: "Email already taken" });
        }
      }
    }
    res.status(500).json({ message: "An error occured while signing up." });
    return;
  }
});

route.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const validCreds = SigninCreds.safeParse({ username, password });
  if (!validCreds.success) {
    res.status(400).json({ message: "Invalid credentials." });
    return;
  }
  try {
    const userFound = await db.user.findUnique({ where: { username } });
    if (!userFound) {
      res.status(403).json({ message: "Invalid username or password" });
      return;
    }
    if (userFound.password) {
      const correcPassword = bcrypt.compareSync(password, userFound.password);
      if (!correcPassword) {
        res.status(403).json({ message: "Invalid username or password" });
        return;
      }
    }
    const token = jwt.sign(
      {
        id: userFound.id,
        role: userFound.role,
        username: userFound.username,
      },
      process.env.JWT_SECRET!
    );
    res.cookie("token", token, {
      sameSite: "none",
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({
      message: "Successfully signed in.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occured while signing in.", error: err });
  }
});

route.get("/oauth/google", async (req, res) => {
  const code = req.query.code as string;
  const data = await getGoogleOAuthToken(code);
  const googleUser = await getGoogleUserDetails(
    data?.data.access_token,
    data?.data.id_token
  );

  try {
    const existingUser = await db.user.findUnique({
      where: { email: googleUser?.data.email },
    });
    if (existingUser) {
      const token = jwt.sign(
        {
          id: existingUser.id,
          role: existingUser.role,
          username: existingUser.username,
        },
        process.env.JWT_SECRET!
      );
      res.cookie("token", token, {
        sameSite: "none",
        httpOnly: true,
        secure: true,
      });
      res
        .status(200)
        .redirect(
          "https://live-classes.arvindkhoisnam.com/dashboard/all-classes"
        );
    } else {
      const newUser = await db.user.create({
        data: {
          email: googleUser?.data.email,
          username: `${googleUser?.data.email.split("@")[0]}`,
        },
      });
      const token = jwt.sign(
        {
          id: newUser.id,
          role: newUser.role,
          username: newUser.username,
        },
        process.env.JWT_SECRET!
      );
      res.cookie("token", token, {
        sameSite: "none",
        httpOnly: true,
        secure: true,
      });
      res
        .status(200)
        .redirect(
          "https://live-classes.arvindkhoisnam.com/dashboard/all-classes"
        );
    }
  } catch (err) {
    console.log(err);
  }
});
route.get("/user", userMiddleware, async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  try {
    const user = await db.user.findFirst({ where: { id: userId } });
    if (!user) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    res.status(200).json({
      role: user.role,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    throw new Error("An error occured.");
  }
});

route.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Successfully logged out." });
});
export { route };
