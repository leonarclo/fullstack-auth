import { Request, Response } from "express";
import { accountRepository } from "../repositories/accountReposiroty";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRespository";

export class RefreshTokenController {
  async handle(req: Request, res: Response) {
    try {
      const cookie = req.cookies;

      if (!cookie?.jwt) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      const refreshToken = cookie.jwt;

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      const user = accountRepository.findOne({
        where: { refresh_token: refreshToken },
      });

      if (!user) {
        jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_KEY!,
          async (err: any, decoded: any) => {
            if (err) {
              return res.sendStatus(403);
            }
            const hackedUser = await userRepository.findOne({
              where: { id: decoded.id },
            });
            if (hackedUser) {
              await accountRepository.update(
                { userId: hackedUser.id },
                { refresh_token: [] }
              );
              accountRepository.save;
            }
          }
        );
        return res.sendStatus(403);
      }

      let newRefreshTokenArray: string[] = [];
      const account = await accountRepository.findOne({
        where: { refresh_token: refreshToken },
      });

      if (account) {
        newRefreshTokenArray = account.refresh_token.filter(
          (rt) => rt !== refreshToken
        );
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY!,
        async (err: any, decoded: any) => {
          if (err) {
            console.log("expired refresh token");
            await accountRepository.update(
              { refresh_token: refreshToken },
              { refresh_token: newRefreshTokenArray }
            );
          }

          const foundUser = await userRepository.findOne({
            where: { id: decoded.id },
          });

          if (err || foundUser) {
            return res.sendStatus(403);
          }

          const userToken = {
            user: decoded.name,
            role: account?.role,
          };

          const accessToken = jwt.sign(userToken, process.env.JWT_KEY!, {
            expiresIn: "5s",
          });

          const newRefreshToken = jwt.sign(
            userToken.user,
            process.env.JWT_REFRESH_KEY!,
            {
              expiresIn: "10s",
            }
          );

          await accountRepository.update(
            { refresh_token: refreshToken },
            { refresh_token: [...newRefreshTokenArray, newRefreshToken] }
          );
          accountRepository.save;

          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 6000, // 10min
          });

          const user = await userRepository.findOne({
            where: { id: account?.userId },
          });

          const userData = {
            name: user?.name,
            email: user?.email,
            image: user?.image,
            role: account?.role,
            accessToken,
          };

          res.json(userData);
        }
      );
    } catch (error: any) {
      return res.status(500).json({
        message: `A tentativa de login não foi bem sucedida: ${error}`,
      });
    }
  }
}
