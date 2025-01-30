import { UserEntities } from "@/types/Authentication";
import validator from "validator";

export interface loginInter {
 email: string;
  password: string;
}

const loginValidator = async (loginRequest: loginInter) => {
  console.log(loginRequest, "here is the login request");
  if (!validator.isEmail(loginRequest.email)) {
    console.log("mail is problem ");
    throw new Error("Invalid Email");
  }
  if (!validator.isStrongPassword(loginRequest.password)) {
    throw new Error("Passsword is not strong");
  }
  return loginRequest as UserEntities;
};
export default loginValidator;
