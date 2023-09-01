import { AppDataSourceExtern } from "../data-source-extern";
import { PayerClient } from "../entities/PayerClient";

export const payerClientRepository =
  AppDataSourceExtern.getRepository(PayerClient);
