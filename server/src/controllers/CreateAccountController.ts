import { Request, Response } from "express";
import { accountRepository } from "../repositories/accountReposiroty";
import { userRepository } from "../repositories/userRespository";
import { Role } from "../entities/Account";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/mailSender";
import { TokenType } from "../entities/Token";

export class CreateAccountController {
  async handle(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { name, email } = req.body;

      const account = await accountRepository.findOneBy({ email });

      if (!account) {
        const hashedEmail = await bcrypt.hash(email, 8);

        const newUser = userRepository.create({
          name,
          email,
          password: hashedEmail,
        });

        await userRepository.save(newUser);

        const newAccount = accountRepository.create({
          userId: newUser.id,
          email,
          role: Role.FREE,
        });

        await accountRepository.save(newAccount);

        const userId = newUser.id;
        await sendEmail({ email, type: TokenType.ACCESS_TOKEN, userId });

        return res.status(201).json({
          success: true,
          message: "Usuário criado e email de acesso enviado com sucesso!",
        });
      }

      const userId = account.id;
      await sendEmail({ email, type: TokenType.ACCESS_TOKEN, userId });
      return res.status(201).json({
        success: true,
        message: "Email de acesso enviado com sucesso!",
      });
    } catch (error: any) {
      return res.status(500).json({
        message:
          "Ocorreu um erro inesperado... Por favor, tente novamente em alguns instantes.",
      });
    }
  }
}
