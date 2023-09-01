import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Account } from "./entities/Account";
import { Token } from "./entities/Token";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  // logging: true,
  // entities: [`${__dirname}/**/entities/*.{ts,js}`],
  entities: [User, Account, Token],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
  // subscribers: [],
});
