import { Request, Response } from "express";

export const getToken = async (req: Request, res: Response, token: string) => {
  try {
    const { cookie } = req.headers;

    if (!cookie) {
      return null;
    }

    const splitCookies = cookie.split("; ");

    const getToken = splitCookies.find((item) => item.startsWith(token));

    if (!getToken) {
      return null;
    }

    const thisToken = getToken.split("=")[1];

    return thisToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};
