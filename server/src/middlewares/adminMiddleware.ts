import { userRepository } from "../repositories/userRespository";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { accountRepository } from "../repositories/accountReposiroty";
import { Role } from "../entities/Account";
import { getToken } from "../utils/getToken";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = (await getToken(req, res, "token_session")) as string;

    if (!token) {
      return res.status(401).json({ message: "Não autorizado!" });
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_KEY!);

    const user = await userRepository.findOneBy({ id: decodedToken.id });

    if (!user) {
      return res.status(401).json({ message: "Não autorizado!" });
    }

    const admin = await accountRepository.findOne({
      where: {
        userId: user.id,
        role: Role.ADMIN,
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
