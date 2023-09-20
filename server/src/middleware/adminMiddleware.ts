import { userRepository } from "../repositories/userRespository";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { accountRepository } from "../repositories/accountReposiroty";

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

    const account = await accountRepository.findOne({
      where: {
        userId: user.id,
      },
    });

    const userData = {
      name: user.name,
      email: user.email,
      image: user.image,
      token: token,
      account_type: account?.account_type,
      account_access_token: account?.access_token,
      account_expires_at: account?.expires_at,
    };

    req.userData = userData;
    next();
  } catch (error: any) {
    return res.status(500).json(error);
  }
};
