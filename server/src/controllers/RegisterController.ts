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
      const { name, email, password } = req.body;

      const user = await userRepository.findOneBy({ email });

      if (user) {
        return res.status(400).json({ message: "Usuário já existe!" });
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

      const newAccount = accountRepository.create({
        userId: newUser.id,
        email: newUser.email,
        role: Role.FREE,
      });

      await accountRepository.save(newAccount);

      if (isClient) {
        const userId = newUser.id;
        await sendEmail({ email, type: TokenType.ACCESS_TOKEN, userId });

        return res.status(201).json({
          message:
            "Usuário cliente! Em instantes você receberá um email com o seu link de acesso!",
          success: true,
        });
      }

      const userId = newUser.id;
      await sendEmail({ email, type: TokenType.VERIFY_EMAIL, userId });

      return res.status(201).json({
        message:
          "Usuário criado com sucesso! Se você já é nosso cliente, entre em contato para receber seu link de acesso.",
        success: true,
      });
    } catch (error: any) {
      return res.status(500).json(error);
    }
  }
}
