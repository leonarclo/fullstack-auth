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
          .json({ message: "Email and password are required for login." });
      }

      const user = await userRepository.findOneBy({ email });

      if (!user) {
        return res.status(401).json({ message: "Email not found." });
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return res.status(400).json({ message: "Incorrect password." });
      }

      const account = await accountRepository.findOne({
        where: { userId: user.id },
      });

      if (!account) {
        return res.status(401).json({ message: "User not registered." });
      }

      const accessTokenPayload = {
        id: user.id,
        name: user.name,
        role: account.role,
      };

      const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_KEY!, {
        expiresIn: "10m",
      });

      const refreshTokenPayload = {
        name: user.name,
      };

      const newRefreshToken = jwt.sign(
        refreshTokenPayload,
        process.env.JWT_REFRESH_KEY!,
        {
          expiresIn: "1h",
        }
      );

      let newRefreshTokenArray: string[] = [];

      if (req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt;
        const foundToken = await accountRepository.findOne({
          where: { refresh_token: refreshToken },
        });

        // Detected refresh token reuse!
        if (!foundToken) {
          console.log("Attempted token reuse for login!");
        } else {
          newRefreshTokenArray = account.refresh_token.filter(
            (rt) => rt !== refreshToken
          );
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      }

      newRefreshTokenArray.push(newRefreshToken);
      await accountRepository.update(
        { userId: user.id },
        { refresh_token: newRefreshTokenArray }
      );

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000, // 1h
      });

      return res.status(200).json({
        accessToken,
        role: account.role,
        message: "Login successful!",
        success: true,
      });
    } catch (error) {
      console.error("An internal server error occurred:", error);
      return res
        .status(500)
        .json({ message: "An internal server error occurred." });
    }
  }
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
