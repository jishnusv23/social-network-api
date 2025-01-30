import { UserService } from "@/services/user.service";
import { Request, Response, NextFunction } from "express";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }


  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId; 
      const user = await this.userService.getUserById(userId as string);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };


  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId ;
      const updatedUser = await this.userService.updateUser(userId as string, req.body);
      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  };


 
}
