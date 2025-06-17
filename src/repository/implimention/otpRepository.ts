import { OtpEntity } from "../../types/TypesAndInterfaces.ts";
import { IOTPrespository } from "../interface/IOtpRepsitory.ts";
import { IOTPWithID } from "../../types/TypesAndInterfaces.ts";
import { OtpModel } from "../../models/otpModel.ts";
import BaseRepository from "./baseRepository.ts";

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
