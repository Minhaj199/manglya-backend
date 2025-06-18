import {
  IReportAbuserMongoDoc,
  IAbuserReport,
} from "../../types/TypesAndInterfaces";

export interface IReportAbuserRepository {
  fetchComplain(
    id: string,
    reason: string,
    profileId: string
  ): Promise<IReportAbuserMongoDoc | null>;
  fetchMessages(): Promise<IReportAbuserMongoDoc[] | []>;
  create(data: IAbuserReport): Promise<IReportAbuserMongoDoc>;
  update(id: string, field: string, change: string | boolean): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
