import { Types } from "mongoose";
import { IReportAbuserRepository } from "../interface/IAbuseRepository";
import { IReportAbuserMongoDoc } from "../../types/TypesAndInterfaces";
import { reportUser } from "../../models/reportedUserModel";
import BaseRepository from "./baseRepository";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain";

export class ReportUserRepository
  extends BaseRepository<IReportAbuserMongoDoc>
  implements IReportAbuserRepository
{
  constructor() {
    super(reportUser);
  }
  async fetchComplain(
    id: string,
    reason: string,
    partnerId: string
  ): Promise<IReportAbuserMongoDoc | null> {
    try {
      return await this.model.findOne({reporter: new Types.ObjectId(id),reported: new Types.ObjectId(partnerId),
        reason: reason,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async fetchMessages(): Promise<IReportAbuserMongoDoc[] | []> {
    try {
      const response = await this.model
        .find()
        .sort({ _id: -1 })
        .populate("reporter", "PersonalInfo.firstName")
        .populate("reported", "PersonalInfo.firstName");
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async delete(id: string): Promise<boolean> {
    try {
      const response: { acknowledged: boolean; deletedCount: number } =
        await reportUser.deleteOne({ _id: new Types.ObjectId(id) });
      if (response.acknowledged) {
        return true;
      } else {
        throw new Error("error on deletion");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async update(
    id: string,
    field: string,
    change: string | boolean
  ): Promise<boolean> {
    try {
      const response = await reportUser.updateOne(
        { _id: new Types.ObjectId(id) },
        { $set: { [field]: change } }
      );

      if (response) {
        return true;
      } else {
        throw new Error("error on setWaring");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
}
