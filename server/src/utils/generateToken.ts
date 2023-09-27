import { Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (
  res: Response,
  userId: String,
  days: String,
  tokenName: String
) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY!, {
    expiresIn: `${days}d`,
  });
  res.cookie(`${tokenName}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  });
};
