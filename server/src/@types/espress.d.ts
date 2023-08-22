import { Request } from "express";
import { TypeAccount } from "../entities/Account";

declare global {
  namespace Express {
    interface Request {
      userData?: {
        name: string;
        email: string;
        image: string;
        token: string;
        account_type?: TypeAccount | null;
        account_access_token?: string | null;
        account_expires_at?: Date | null;
      };
    }
  }
}
