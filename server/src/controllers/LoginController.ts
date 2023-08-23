import { Request, Response } from "express";
import { userRepository } from "../repositories/userRespository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/mailSender";
import { TokenType } from "../entities/Token";
import { tokenRepository } from "../repositories/tokenRepository";
import { MoreThan } from "typeorm";

export class LoginController {
  async handle(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { cookie } = req.headers;
      const user = await userRepository.findOneBy({ email });

      if (!user) {
        return res.status(400).json({ message: "Email não encontrado!" });
      }

      if (cookie) {
        res.clearCookie("token_session", { httpOnly: true });
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return res.status(400).json({ message: "Senha incorreta!" });
      }

      const tokenExist = await tokenRepository.findOne({
        where: {
          identifier: user.id,
          expires_at: MoreThan(new Date()),
          token_type: TokenType.VERIFY_EMAIL,
        },
      });

      if (user.verified_email == undefined && !tokenExist) {
        const userId = user.id;
        await sendEmail({ email, type: TokenType.VERIFY_EMAIL, userId });
      }

      const userToken = {
        id: user.id,
        name: user.name,
      };

      const token = jwt.sign(userToken, process.env.JWT_KEY!, {
        expiresIn: "1d",
      });

      res.cookie("token_session", token, { httpOnly: true });

      return res.status(200).json({
        message: "Logado com sucesso!",
        user: { id: user.id, name: user.name, email: user.email, token },
      });
    } catch (error: any) {
      return res.status(500).json({ message: error });
    }
  }
}