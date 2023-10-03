import { userRepository } from "../repositories/userRespository";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { accountRepository } from "../repositories/accountReposiroty";

export const authMiddleware = async (
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
          "Não foi possível receber o cabeçalh com o token de autorização!",
      });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(403)
        .json({ message: "Ocorreu um erro ao receber o token de acesso!" });
    }
    console.log(token);

    jwt.verify(token, process.env.JWT_KEY!, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Token inválido!" });
      }

      const user = await userRepository.findOne({ where: { id: decoded.id } });
      const account = await accountRepository.findOne({
        where: { userId: user?.id },
      });

      const userData = {
        user: user?.name,
        email: user?.email,
        image: user?.image,
        role: account?.role,
      };

      (req as any).userData = userData;
      next();
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Não autorizado! Token não encontrado!" });
  }
};
