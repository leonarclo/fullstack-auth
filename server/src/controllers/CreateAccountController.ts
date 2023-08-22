import { Request, Response } from "express";
import { accountRepository } from "../repositories/accountReposiroty";
import { userRepository } from "../repositories/userRespository";
import { TypeAccount } from "../entities/Account";
import bcrypt from "bcrypt";

export class CreateAccountController {
  async handle(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { name, email } = req.body;

      const account = await accountRepository.findOne({ where: { email } });

      if (account) {
        await accountRepository.update(
          { email },
          { account_type: TypeAccount.PAID }
        );

        return res.status(400).json({
          message:
            "Este email já estava cadastrado! Acesso alterado para 'PAID'",
        });
      }

      const hashedPassword = await bcrypt.hash(email, 8);

      const newUser = userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      await userRepository.save(newUser);

      const newAccount = accountRepository.create({
        userId: newUser.id,
        email,
        account_type: TypeAccount.PAID,
        expires_at: new Date(new Date().getTime() + 31557600000), //1 year
      });

      await accountRepository.save(newAccount);

      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
    } catch (error: any) {
      return res.status(500).json(error);
    }
  }
}
