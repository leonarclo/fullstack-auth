import { Request, Response } from "express";
import { userRepository } from "../repositories/userRespository";
import { tokenRepository } from "../repositories/tokenRepository";
import { MoreThan } from "typeorm";
import { TokenType } from "../entities/Token";

export class VerifyEmailController {
  async handle(req: Request, res: Response) {
    try {
      console.log(req.body);

      const { token } = req.body;

      const userToken = await tokenRepository.findOne({
        where: {
          token,
          expires_at: MoreThan(new Date(new Date().getTime())),
          token_type: TokenType.VERIFY_EMAIL,
        },
      });

      console.log(userToken);

      if (!userToken) {
        return res.status(404).json({
          message:
            "Token inválido ou expirado! Faça login novamente para receber um novo email de verificação.",
        });
      }

      await userRepository.update(
        { id: userToken.identifier },
        { verified_email: new Date(Date.now()) }
      );

      await tokenRepository.delete({ token });

      return res.status(200).json({
        message: "Email Verificado com sucesso!",
      });
    } catch (error: any) {
      return res.status(500).json({
        message:
          "Ocorreu um erro inesperado... Por favor, tente novamente em alguns instantes.",
      });
    }
  }
}
