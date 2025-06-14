import { IJwtService } from "../../types/UserRelatedTypes.ts"; 
import { IAdminAuthService } from "../interfaces/IAaminAuthenticationServices.ts"; 
import dotenv from 'dotenv'
dotenv.config()
export class AdminAuth implements IAdminAuthService {
  private jwtGenerator: IJwtService;

  constructor(jwtAdatper: IJwtService) {
    this.jwtGenerator = jwtAdatper;
  }
  login(email: string, password: string) {
    try {
      const adminEmail = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;
      const jwt_key = process.env.JWT_ACCESS_SECRET_ADMIN;
      if (adminEmail === email) {
        if (adminPassword === password) {
          if (!jwt_key) {
            throw new Error("secret key is not found");
          } else {
            const JWT_SECRET = jwt_key;
            const adminID=process.env.ADMIN_ID
            if(!adminID){
               return { message: "interal server error", token: "" };
            }
            const token = this.jwtGenerator.createAccessToken(
              { id: adminID, role: "admin" },
              JWT_SECRET,
              { expiresIn: "1h" }
            );
            if (!token) {
              throw new Error("internal server error token not generated");
            }
            return { message: "admin verified", token };
          }
        } else {
          return { message: "password not matching", token: "" };
        }
      } else {
        return { message: "user name not found", token: "" };
      }
    } catch (error) {
      if(error instanceof Error){

        throw new Error(error.message);
      }else{
        throw new Error('un expected error');

      }
    }
  }
}
