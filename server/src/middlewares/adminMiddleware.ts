import { userRepository } from "../repositories/userRespository";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { accountRepository } from "../repositories/accountReposiroty";
import { Role } from "../entities/Account";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer");

    if (!authHeader) {
      return res.status(401).json({
        message:
          "Não foi possível receber o cabeçalho com o token de autorização!",
      });
    }

    const token = req.headers.authorization?.split(" ")[1] as string;

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
