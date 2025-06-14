import { OtpEntity } from "../../domain/entity/otpEntity.ts";

export interface IOTPrespository{
    create(otpData:OtpEntity):Promise<OtpEntity>,
    getOTP(email:string,from:string):Promise<OtpEntity|[]>
}
