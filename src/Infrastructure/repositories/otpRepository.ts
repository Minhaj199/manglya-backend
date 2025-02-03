import { OtpEntity } from "../../domain/entity/otpEntity.js";
import { OTPrespository } from "../../domain/interface/OtpRepsitory.js";
import { OTPWithID } from "../../types/TypesAndInterfaces.js";
import { OtpModel } from "../db/otpModel.js";
import BaseRepository from "./baseRepository.js";

export class OtpRepository extends BaseRepository<OTPWithID> implements OTPrespository {
  constructor (){
    super(OtpModel)
  }
  async getOTP( email: string,from:string): Promise<OtpEntity|[]> {
    
    try {
      const otpDoc:OtpEntity[]= await OtpModel.aggregate([
        { $match: {$and:[{email:email},{from:from}]} },
        { $sort: { _id: -1 }},
        { $limit: 1 },
      ]);
      if(otpDoc.length>0){
      return otpDoc[0] as OtpEntity
      }else{
      return []
      }
      
    } catch (error) {
      throw new Error("otp failure");
    }
  }
}