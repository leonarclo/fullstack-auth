import { userRepository } from "../repositories/userRespository";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { accountRepository } from "../repositories/accountReposiroty";
import { TypeAccount } from "../entities/Account";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cookie } = req.headers;

    if (!cookie) {
      return res.status(401).json({ message: "Não autorizado!" });
    }

    const token = cookie.split("=")[1];

    const decodedToken: any = jwt.verify(token, process.env.JWT_KEY!);

    const user = await userRepository.findOneBy({ id: decodedToken.id });

    if (!user) {
      return res.status(401).json({ message: "Não autorizado!" });
    }

    const admin = await accountRepository.findOne({
      where: {
        userId: user.id,
        account_type: TypeAccount.ADMIN,
      },
    });

    if (!admin) {
      return res.status(401).json({ message: "Não autorizado!" });
    }
    next();
  } catch (error: any) {
    return res.status(500).json(error);
  }
};
