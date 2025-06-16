import bcrypt from "bcryptjs";
import { IBcryptAdapter } from "../types/TypesAndInterfaces";
import { ResponseMessage } from "../constrain/ResponseMessageContrain";

export class BcryptAdapter implements IBcryptAdapter {
  async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async compare(password: string, hashed: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashed);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
}
