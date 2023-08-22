import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { PayerClient } from "./entities/PayerClient";

export const AppDataSourceExtern = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST_EXTERN,
  port: Number(process.env.DB_PORT_EXTERN),
  username: process.env.DB_USERNAME_EXTERN,
  password: process.env.DB_PASSWORD_EXTERN,
  database: process.env.DB_NAME_EXTERN,
  synchronize: true,
  // logging: true,
  // entities: [`${__dirname}/**/entities/*.{ts,js}`],
  entities: [PayerClient],
  migrations: [`${__dirname}/**/migrations/extern/*.{ts,js}`],
  // subscribers: [],
});
