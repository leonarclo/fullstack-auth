import { Request, Response } from "express";
import { userRepository } from "../repositories/userRespository";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/mailSender";
import { TokenType } from "../entities/Token";
import { accountRepository } from "../repositories/accountReposiroty";
import { Role } from "../entities/Account";
import { payerClientRepository } from "../repositories/payerClientRepository";

export class RegisterController {
  async handle(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { name, email, password } = req.body;

      const userExists = await userRepository.findOneBy({ email });

      if (userExists) {
        return res
          .status(400)
          .json({ success: false, message: "Usuário já existe!" });
      }

      const hashedPassword = await bcrypt.hash(password, 8);

      const newUser = userRepository.create({
        name,
        email,
        password: hashedPassword,
      });
      await userRepository.save(newUser);

      const isClient = await payerClientRepository.findOne({
        where: {
          email: newUser.email,
        },
      });

      if (!isClient) {
        const newAccount = accountRepository.create({
          userId: newUser.id,
          email: newUser.email,
          role: Role.FREE,
        });
        await accountRepository.save(newAccount);

        const userId = newUser.id;
        await sendEmail({ email, type: TokenType.VERIFY_EMAIL, userId });

        return res.status(200).json({
          success: true,
          message: "Usuário criado com sucesso!",
        });
      }

      await accountRepository.update(
        { userId: newUser.id },
        { email: newUser.email, role: Role.PAID }
      );

      return res.status(200).json({
        success: true,
        message: "Você é um cliente Dixi! Acesso disponível!",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message:
          "Ops, ocorreu um erro inesperado :c Por favor, tente novamente em alguns instantes.",
        error: error.message,
      });
    }
  }
}
