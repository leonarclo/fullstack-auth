import { Request, Response } from "express";
import { userRepository } from "../repositories/userRespository";
import { tokenRepository } from "../repositories/tokenRepository";
import { MoreThan } from "typeorm";
import { TokenType } from "../entities/Token";
import { sendEmail } from "../utils/mailSender";

export class ForgetPasswordController {
  async handle(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await userRepository.findOneBy({ email });

      if (!user) {
        return res.status(404).json({ message: "Email não encontrado!" });
      }

      const tokenExist = await tokenRepository.findOne({
        where: {
          identifier: user.id,
          expires_at: MoreThan(new Date(new Date().getTime())),
          token_type: TokenType.RESET_PASSWORD,
        },
      });

      if (tokenExist) {
        return res.status(400).json({
          message:
            "O email para a redefinição de senha já foi enviado. Aguarte alguns minutos para enviar novamente!",
        });
      }

      const userId = user.id;
      sendEmail({ email, type: TokenType.RESET_PASSWORD, userId });

      return res.status(200).json({
        message: "Email para redefinição de senha enviado com sucesso!",
      });
    } catch (error: any) {
      return res.status(500).json({
        message:
          "Ocorreu um erro inesperado... Por favor, tente novamente em alguns instantes.",
      });
    }
  }
}
