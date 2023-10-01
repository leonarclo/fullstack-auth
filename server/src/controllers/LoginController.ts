import { Request, Response } from "express";
import { userRepository } from "../repositories/userRespository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getToken } from "../utils/getToken";
import { accountRepository } from "../repositories/accountReposiroty";

export class LoginController {
  async handle(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email e senha são obrigatórios para login!" });
      }
      const user = await userRepository.findOneBy({ email });

      if (!user) {
        return res.status(401).json({ message: "Email não encontrado!" });
      }
      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return res.status(400).json({ message: "Senha incorreta!" });
      }

      // const currentTimestamp = new Date().getTime();
      // const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

      // const tokenExist = await tokenRepository.findOne({
      //   where: {
      //     identifier: user.id,
      //     expires_at: MoreThan(new Date()),
      //     token_type: TokenType.VERIFY_EMAIL,
      //   },
      // });

      // if (
      //   user.verified_email == undefined &&
      //   (!tokenExist ||
      //     tokenExist?.expires_at <=
      //       new Date(currentTimestamp - twentyFourHoursInMillis))
      // ) {
      //   const userId = user.id;
      //   await sendEmail({ email, type: TokenType.VERIFY_EMAIL, userId });
      //   return res
      //     .status(200)
      //     .json({ message: "Logado com sucesso!", success: true });
      // }

      const userToken = {
        name: user.name,
      };

      const accessToken = jwt.sign(userToken, process.env.JWT_KEY!, {
        expiresIn: "10s",
      });

      const newRefreshToken = jwt.sign(
        userToken,
        process.env.JWT_REFRESH_KEY!,
        {
          expiresIn: "1m",
        }
      );

      let refreshTokenExist = (await getToken(
        req,
        res,
        "token_session"
      )) as string;

      const account = await accountRepository.findOne({
        where: { userId: user.id },
      });

      if (!account) {
        return res.status(401).json({ message: "Conta não encontrada!" });
      }

      let refreshTokenArray: string[] | undefined = [];
      if (!refreshTokenExist) {
        refreshTokenArray = account.refresh_token as [];
      }
      refreshTokenArray =
        account.refresh_token?.filter((x) => x !== refreshTokenExist) || [];

      if (refreshTokenExist) {
        const refreshToken = newRefreshToken;
        const foundToken = await accountRepository.findOne({
          where: { refresh_token: refreshToken },
        });

        if (!foundToken) {
          refreshTokenArray = [];
        }

        res.clearCookie("token_session", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      }

      if (newRefreshToken) {
        refreshTokenArray.push(newRefreshToken);
      }

      account.refresh_token = refreshTokenArray;
      accountRepository.save;

      res.cookie("token_session", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      const userData = {
        name: user.name,
        email: user.email,
        image: user.image,
        role: account.role,
        accessToken,
      };

      return res.status(200).json({
        message: "Logado com sucesso!",
        userData,
        success: true,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Ocorreu um erro interno no servidor." });
    }
  }
}
