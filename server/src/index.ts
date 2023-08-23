import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { AppDataSource } from "./data-source";
import { AppDataSourceExtern } from "./data-source-extern";

AppDataSource.initialize();
AppDataSourceExtern.initialize();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());

app.use(routes);

app.listen(3001, async () => {
  console.log("server works!");
});
