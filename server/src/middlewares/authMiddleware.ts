import { userRepository } from "../repositories/userRespository";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { accountRepository } from "../repositories/accountReposiroty";
import { getToken } from "../utils/getToken";

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
      return res.status(403).json({ message: "Não logado!" });
    }

    const decodedToken: any = jwt.verify(access_token, process.env.JWT_KEY!);

    const user = await userRepository.findOneBy({ id: decodedToken.id });

    if (!user) {
      return res.status(401).json({ message: "Não autorizado!" });
    }

    const account = await accountRepository.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!account) {
      return res.status(401).json({ message: "Não autorizado!" });
    }

    const userData = {
      name: user.name,
      email: user.email,
      image: user.image,
      token: access_token,
      role: account.role,
    };

    (req as any).userData = userData;
    next();
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Não autorizado! Token não encontrado!" });
  }
};
