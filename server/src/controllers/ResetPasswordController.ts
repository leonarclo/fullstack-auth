import { Request, Response } from "express";
import { userRepository } from "../repositories/userRespository";
import { tokenRepository } from "../repositories/tokenRepository";
import { MoreThan } from "typeorm";
import { TokenType } from "../entities/Token";
import bcrypt from "bcrypt";

export class ResetPasswordController {
  async handle(req: Request, res: Response) {
    try {
      const { newPassword, token } = req.body;

      const userToken = await tokenRepository.findOne({
        where: {
          token,
          expires_at: MoreThan(new Date(new Date().getTime())),
          token_type: TokenType.RESET_PASSWORD,
        },
      });

      if (!userToken) {
        return res.status(404).json({ message: "Token inválido ou expirado!" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 8);

      await userRepository.update(
        { id: userToken.identifier },
        { password: hashedPassword }
      );

      await tokenRepository.delete({ token });

      return res.status(200).json({
        message: "Senha redefinida com sucesso!",
      });
    } catch (error: any) {
      return res.status(500).json({
        message:
          "Ocorreu um erro inesperado... Por favor, tente novamente em alguns instantes.",
      });
    }
  }
}
