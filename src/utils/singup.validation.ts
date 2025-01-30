import { Authentication, UserEntities } from "../types/Authentication";
import validator from "validator";
import ErrorResponse from "./errorResponse";



const validateUser = async (user: Authentication) => {
  if (user.name?.trim() === "" || user.email.trim() === "") {
    throw ErrorResponse.badRequest("All Fields are Required");
  }

  if (!validator.isEmail(user.email)) {
    throw ErrorResponse.badRequest("Invaild Email");
  }

  if (!validator.isStrongPassword(user.password)) {
    throw ErrorResponse.badRequest("Password is not strong");
  }
  
  return user as UserEntities;
};
export default validateUser;
