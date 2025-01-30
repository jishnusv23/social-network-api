import { authMiddleware } from "@/middleware/auth";
import { UserController } from "../controller/userController.controller";
import { Router } from "express";
const router=Router()
const userController=new UserController()


router.get("/profile",authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware,userController.updateProfile);