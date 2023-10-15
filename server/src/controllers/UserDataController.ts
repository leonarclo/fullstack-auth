import { NextFunction, Request, Response } from "express";

export class UserDataController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      return res.json((req as any).userData);
    } catch (err: any) {
      next(err);
    }
  }
}
