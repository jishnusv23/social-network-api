import { authController } from "../controller/authController.controller";
import { Router } from "express";

const router = Router();
const AuthController=new authController()
router.post("/signup",AuthController.register);
router.post("/login",AuthController.login);
export default router;
