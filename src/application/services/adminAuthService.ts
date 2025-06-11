import { JWTAdapter } from "../../infrastructure/jwt.ts"; 
import { AdminAuthCase } from "../../types/serviceLayerInterfaces.ts"; 
export class AdminAuth implements AdminAuthCase {
  private jwtGenerator: JWTAdapter;

  constructor(jwtAdatper: JWTAdapter) {
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
            const token = this.jwtGenerator.createAccessToken(
              { id: "123", role: "admin" },
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
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
