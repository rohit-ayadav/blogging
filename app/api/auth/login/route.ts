import { connectDB } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import User from "../../../../models/users.models";
import { getSession } from "next-auth/react";

connectDB();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (session) {
      return res.status(400).json({ message: "You are already signed in." });
    }

    interface UserData {
      email: string;
      password: string;
    }

    const { email, password } = req.body as UserData;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const hashedPassword = await hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({ message: "User created.", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
}
