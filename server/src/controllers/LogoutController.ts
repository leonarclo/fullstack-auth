import { Request, Response } from "express";

export class LogoutController {
  async handle(req: Request, res: Response) {
    try {
      res.clearCookie("token_session", { httpOnly: true });
      return res.status(200).json({ message: "Logout Successful" });
    } catch (error: any) {
      return res.status(500).json({ message: error });
    }
  }
}
