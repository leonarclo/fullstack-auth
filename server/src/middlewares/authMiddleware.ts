import { userRepository } from "../repositories/userRespository";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { accountRepository } from "../repositories/accountReposiroty";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let access_token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    const decoded = jwt.verify(
      access_token,
      process.env.JWT_KEY!
    ) as JwtPayload;

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Token inválido ou usuário não existe!" });
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
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Não autorizado! Token não encontrado!" });
  }
};
