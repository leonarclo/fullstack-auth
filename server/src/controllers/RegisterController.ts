import { Request, Response } from "express";
import { userRepository } from "../repositories/userRespository";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/mailSender";
import { TokenType } from "../entities/Token";
import { accountRepository } from "../repositories/accountReposiroty";
import { TypeAccount } from "../entities/Account";
import { payerClientRepository } from "../repositories/payerClientRepository";

export class RegisterController {
  async handle(req: Request, res: Response) {
    try {
      console.log(req.body);
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

      const newAccount = accountRepository.create({
        userId: newUser.id,
        account_type: TypeAccount.FREE,
        expires_at: new Date(new Date().getTime() + 31557600000),
      });

      await accountRepository.save(newAccount);

      const isClient = await payerClientRepository.findOne({
        where: {
          email: newUser.email,
        },
      });

      if (isClient) {
        await accountRepository.update(
          { userId: newUser.id },
          { account_type: TypeAccount.PAID }
        );

        await userRepository.update(
          { id: newUser.id },
          { verified_email: new Date(new Date().getTime()) }
        );

        return res.status(201).json({
          message: "Email encontrado na base de dados de clientes!",
        });
      }

      const userId = newUser.id;
      await sendEmail({ email, type: TokenType.VERIFY_EMAIL, userId });

      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
    } catch (error: any) {
      return res.status(500).json(error);
    }
  }
}
