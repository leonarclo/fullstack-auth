import { Router } from "express";
import { RegisterController } from "./controllers/RegisterController";
import { LoginController } from "./controllers/LoginController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { LogoutController } from "./controllers/LogoutController";
import { PayerClientController } from "./controllers/PayerClientController";
import { ForgetPasswordController } from "./controllers/ForgetPasswordController";
import { ResetPasswordController } from "./controllers/ResetPasswordController";
import { VerifyEmailController } from "./controllers/VerifyEmailController";
import { CreateAccountController } from "./controllers/CreateAccountController";
import { adminMiddleware } from "./middlewares/adminMiddleware";
import { AccessTokenController } from "./controllers/AccessTokenController";
import { YoutubeApiController } from "./controllers/YoutubeApiController";
import { RefreshTokenController } from "./controllers/RefreshTokenController";

const routes = Router();

routes.post(
  "/create-account",
  adminMiddleware,
  new CreateAccountController().handle
);
routes.post("/forget-password", new ForgetPasswordController().handle);
routes.post("/login", new LoginController().handle);
routes.get("/logout", new LogoutController().handle);
routes.get(
  "/api/youtube/playlists",
  new YoutubeApiController().handlePlaylistsName
);
routes.get(
  "/api/youtube/videosPerPlaylist",
  new YoutubeApiController().handleVideoPerPlaylist
);
routes.post("/payer-client", new PayerClientController().handle);
routes.post("/register-user", new RegisterController().handle);
routes.post("/reset-password", new ResetPasswordController().handle);
routes.post("/verify-email", new VerifyEmailController().handle);
routes.post("/access-token", new AccessTokenController().handle);
routes.get("/refresh", authMiddleware, new RefreshTokenController().handle);

export default routes;
