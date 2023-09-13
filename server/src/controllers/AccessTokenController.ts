import { Request, Response } from "express";
import { userRepository } from "../repositories/userRespository";
import { tokenRepository } from "../repositories/tokenRepository";
import { MoreThan } from "typeorm";
import { TokenType } from "../entities/Token";
import { accountRepository } from "../repositories/accountReposiroty";
import { Role } from "../entities/Account";

export class AccessTokenController {
  async handle(req: Request, res: Response) {
    try {
      const { token } = req.body;

      const userToken = await tokenRepository.findOne({
        where: {
          token,
          expires_at: MoreThan(new Date(new Date().getTime())),
          token_type: TokenType.ACCESS_TOKEN,
        },
      });

      console.log(userToken);

      if (!userToken) {
        return res.status(404).json({ message: "Token inválido ou expirado!" });
      }

      await accountRepository.update(
        { id: userToken.identifier },
        {
          role: Role.PAID,
          access_token_expires_at: new Date(new Date().getTime() + 31557600), //1 ano
        }
      );

      const user = await userRepository.findOne({
        where: {
          id: userToken.identifier,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado!",
        });
      }

      if (user.verified_email === undefined) {
        await userRepository.update(
          { id: userToken.identifier },
          { verified_email: new Date(Date.now()) }
        );
      }

      await tokenRepository.delete({ token });

      return res
        .status(200)
        .json({ success: true, message: "Email Verificado com sucesso!" });
    } catch (error: any) {
      return res.status(500).json({
        message:
          "Ocorreu um erro inesperado... Por favor, tente novamente em alguns instantes.",
      });
    }
  }
}
