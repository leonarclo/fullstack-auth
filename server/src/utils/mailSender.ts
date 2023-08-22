import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { userRepository } from "../repositories/userRespository";
import { tokenRepository } from "../repositories/tokenRepository";
import { TokenType } from "../entities/Token";

interface ISendEmail {
  email: string;
  type: TokenType;
  userId: string;
}

export const sendEmail = async ({ email, type, userId }: ISendEmail) => {
  try {
    const hashedToken = await bcrypt.hash(userId, 8);

    const user = await userRepository.findOneBy({ email });

    const userToken = {
      identifier: userId,
      token: hashedToken,
      expires_at: new Date(new Date().getTime() + 1800000), //30min
      token_type: type,
    };

    if (user) {
      tokenRepository.create(userToken);
      await tokenRepository.save(userToken);
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_EMAIL_PASS,
      },
    });

    // ======================================
    let subject, path, todo;
    if (type === TokenType.VERIFY_EMAIL) {
      subject = "Verificação de Email ✔";
      path = "verify-email";
      todo = "verificar seu email.";
    } else if (type === TokenType.RESET_PASSWORD) {
      subject = "Redefinição de Senha 🔑";
      path = "password/reset";
      todo = "redefinir sua senha.";
    } else {
      subject = "Link de Acesso 🚀";
      path = "access-link";
      todo = "ativar seu acesso.";
    }
    // ======================================
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: subject,
      html: `<p><a href="${process.env.BASE_URL}/${path}?token=${hashedToken}">Clique aqui</a> para ${todo}</p>`,
    };

    const mailResponse = transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.log(error);
  }
};
