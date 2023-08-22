import { Router } from "express";
import { RegisterController } from "./controllers/RegisterController";
import { LoginController } from "./controllers/LoginController";
import { authMiddleware } from "./middleware/authMiddleware";
import { UserDataController } from "./controllers/UserDataController";
import { LogoutController } from "./controllers/LogoutController";
import { PayerClientController } from "./controllers/PayerClientController";
import { ForgetPasswordController } from "./controllers/ForgetPasswordController";
import { ResetPasswordController } from "./controllers/ResetPasswordController";
import { VerifyEmailController } from "./controllers/VerifyEmailController";
import { CreateAccountController } from "./controllers/CreateAccountController";

const routes = Router();

routes.post("/create-account", new CreateAccountController().handle);
routes.post("/forget-password", new ForgetPasswordController().handle);
routes.post("/login", new LoginController().handle);
routes.get("/logout", new LogoutController().handle);
routes.post("/payer-client", new PayerClientController().handle);
routes.post("/register", new RegisterController().handle);
routes.post("/reset-password", new ResetPasswordController().handle);
routes.get("/user-data", authMiddleware, new UserDataController().handle);
routes.post("/verify-email", new VerifyEmailController().handle);

export default routes;
