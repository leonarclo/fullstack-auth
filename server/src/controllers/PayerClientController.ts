import { Request, Response } from "express";
import { payerClientRepository } from "../repositories/payerClientRepository";

export class PayerClientController {
  async handle(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { name, email } = req.body;

      const user = await payerClientRepository.findOneBy({ email });

      if (user) {
        return res.status(400).json({ message: "Usuário já existe!" });
      }

      const newUser = payerClientRepository.create({
        name,
        email,
      });

      await payerClientRepository.save(newUser);

      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
    } catch (error: any) {
      return res.status(500).json(error);
    }
  }
}
