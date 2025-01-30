import validateUser from "../utils/singup.validation";
import { AuthServices } from "../services/authService.service";
import { Request, Response, NextFunction } from "express";
import { Authentication } from "@/types/Authentication";
import jwt from "jsonwebtoken";
import loginValidator from "../utils/login.validation";

export class authController {
  private authservice: AuthServices;
  constructor() {
    this.authservice = new AuthServices();
  }
   generateJWT(user: Authentication) {
      return jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );
    }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let afterValidUser = await validateUser(req.body);
      console.log(
        "🚀 ~ file: authController.controller.ts:16 ~ authController ~ register=async ~ afterValidUser:",
        afterValidUser
      );
      const respnsoe = await this.authservice.registeruser(afterValidUser);
     
      const token = this.generateJWT(respnsoe);
     
      res.cookie('access_token',token,{maxAge: 24 * 60 * 60 * 1000})
    } catch (error: any) {}
  };
  login=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const afterValidUser=await loginValidator(req.body)
        const respnsoe = await this.authservice.loginUser(afterValidUser);
         const token = this.generateJWT(respnsoe);

         res.cookie("access_token", token, { maxAge: 24 * 60 * 60 * 1000 });

    }catch(error){
        next(error)
    }

  }
}
