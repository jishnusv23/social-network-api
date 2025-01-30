import { Types } from "mongoose";
export interface Authentication {
  _id?: Types.ObjectId;
  name?: string;
  email: string;
  password: string;

}



export interface UserEntities {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  isActive: boolean;
  friends?: Types.ObjectId[];
  lastLogin?: Date;
}