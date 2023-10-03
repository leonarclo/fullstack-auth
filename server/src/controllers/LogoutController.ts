import { Request, Response } from "express";
import { accountRepository } from "../repositories/accountReposiroty";

export class LogoutController {
  async handle(req: Request, res: Response) {
    const cookie = req.cookies;
    if (!cookie?.jwt) {
      return res.sendStatus(204); //No content
    }

    const refreshToken = cookie.jwt;

    // Is refreshToken in db?
    const user = await accountRepository.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.sendStatus(204);
    }

    const thisRefreshToken = user.refresh_token.filter(
      (rt) => rt !== refreshToken
    );

    // Delete refreshToken in db
    await accountRepository.update(
      { refresh_token: refreshToken },
      { refresh_token: thisRefreshToken }
    );
    accountRepository.save;

    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.sendStatus(204);
  }
}
