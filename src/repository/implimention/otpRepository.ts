import { OtpEntity } from "../../types/TypesAndInterfaces";
import { IOTPrespository } from "../interface/IOtpRepsitory";
import { IOTPWithID } from "../../types/TypesAndInterfaces";
import { OtpModel } from "../../models/otpModel";
import BaseRepository from "./baseRepository";

export class OtpRepository
  extends BaseRepository<IOTPWithID>
  implements IOTPrespository
{
  constructor() {
    super(OtpModel);
  }
  async fetchOTP(email: string, from: string): Promise<OtpEntity | []> {
    try {
      const otpDoc: OtpEntity[] = await OtpModel.aggregate([
        { $match: { $and: [{ email: email }, { from: from }] } },
        { $sort: { _id: -1 } },
        { $limit: 1 },
      ]);
      if (otpDoc.length > 0) {
        return otpDoc[0] as OtpEntity;
      } else {
        return [];
      }
    } catch {
      throw new Error("otp failure");
    }
  }
}
