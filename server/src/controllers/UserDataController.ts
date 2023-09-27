import { Request, Response } from "express";

export class UserDataController {
  async handle(req: Request, res: Response) {
    try {
      return res.json(req.userData);
    } catch (error: any) {
      return res.status(500).json({ message: "Usuário não encontrado!" });
    }
  }
}
