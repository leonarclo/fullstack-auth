import { Request, Response } from "express";
import { getToken } from "../utils/getToken";
import { accountRepository } from "../repositories/accountReposiroty";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRespository";

export class RefreshTokenController {
  async handle(req: Request, res: Response) {
    try {
      const token: any = getToken(req, res, "refresh_token");
      if (!token) {
        return res.status(401).json({ message: "Ocorreu um erro" });
      }

      jwt.verify(
        token,
        process.env.JWT_REFRESH_KEY!,
        async (err: any, decoded: any) => {
          if (err) {
            return res.status(403).json({ message: "Forbidden" });
          }

          const foundUser = await userRepository.findOne({
            where: { id: decoded.id },
          });

          if (!foundUser) {
            return res.status(401).json({ message: "Unauthorized" });
          }

          const userData = {
            name: foundUser.name,
          };
          const accessToken = jwt.sign(userData, process.env.JWT_KEY!, {
            expiresIn: "1m",
          });
          res.json({ accessToken });
        }
      );

      // res.clearCookie("refresh_token", {
      //   httpOnly: true,
      //   sameSite: "none",
      //   secure: true,
      // });

      // const account = await accountRepository.findOneBy({
      //   refresh_token: token,
      // });

      // if (!account) {
      //   jwt.verify(token, process.env.JWT_REFRESH_KEY!);
      // }

      // let refreshTokenArray: string[] | undefined = [];
      // refreshTokenArray = account?.refresh_token?.filter((x) => x !== token);

      // const decodedToken: any = jwt.verify(token, process.env.JWT_REFRESH_KEY!);

      // const user = await userRepository.findOne({
      //   where: {
      //     id: account?.userId,
      //   },
      // });

      // if (decodedToken.name !== user?.name) {
      //   return res.status(403);
      // }

      // const accessToken = jwt.sign(
      //   { userData: { name: decodedToken?.name } },
      //   process.env.JWT_KEY!,
      //   { expiresIn: "10s" }
      // );

      // const newRefreshToken = jwt.sign(
      //   { userData: { name: user?.name } },
      //   process.env.JWT_REFRESH_KEY!,
      //   { expiresIn: "20s" }
      // );

      // refreshTokenArray?.push(newRefreshToken);

      // await accountRepository.update(
      //   { userId: user?.id },
      //   { refresh_token: refreshTokenArray }
      // );

      // res.cookie("jwt", newRefreshToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "none",
      //   maxAge: 24 * 60 * 60 * 1000,
      // });

      // return res.status(200).json({ accessToken });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Ocorreu um erro interno no servidor." });
    }
  }
}
