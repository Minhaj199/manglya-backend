import { OtpEntity } from "../../types/TypesAndInterfaces"


export interface IOTPrespository{
    create(otpData:OtpEntity):Promise<OtpEntity>,
    getOTP(email:string,from:string):Promise<OtpEntity|[]>
}
