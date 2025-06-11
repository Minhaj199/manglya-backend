import { OtpEntity } from "../entity/otpEntity.ts";

export interface OTPrespository{
    create(otpData:OtpEntity):Promise<OtpEntity>,
    getOTP(email:string,from:string):Promise<OtpEntity|[]>
}
