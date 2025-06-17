import { OtpEntity } from "../../types/TypesAndInterfaces";

export interface IOTPrespository {
  create(otpData: OtpEntity): Promise<OtpEntity>;
  fetchOTP(email: string, from: string): Promise<OtpEntity | []>;
}
