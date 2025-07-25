import { Document, Model } from "mongoose";
import { IBaseRepository } from "../interface/IOtherRepositories";
import { isMongoDuplicateError } from "../../utils/mongoDuplcateErrorFinder";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain";

export default abstract class BaseRepository<T extends Document>
  implements IBaseRepository
{
  constructor(protected model: Model<T>) {}
  async create(data: Partial<T>): Promise<T> {
    try {
      const doc = new this.model(data);
      return (await doc.save()).toObject();
    } catch (error) {
      if (error instanceof Error) {
        if (isMongoDuplicateError(error)) {
          const key = Object.keys(error.keyValue)[0];
          throw new Error(key + " already exists");
        } else {
          throw new Error(error.message || "Error on data fetching");
        }
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
}
