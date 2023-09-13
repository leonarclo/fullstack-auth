import { Request } from "express";
import { Role } from "../entities/Account";

declare global {
  namespace Express {
    interface Request {
      userData?: {
        name: string;
        email: string;
        image: string;
        token: string;
        role?: Role | null;
        account_access_token?: string | null;
        account_expires_at?: Date | null;
      };
    }
  }
}
