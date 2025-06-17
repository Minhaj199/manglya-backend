import {
  IAbuserMongoDoc,
  IAbuserReport,
} from "../../types/TypesAndInterfaces.ts";

export interface IReportAbuserRepository {
  fetchComplain(
    id: string,
    reason: string,
    profileId: string
  ): Promise<IAbuserMongoDoc | null>;
  fetchMessages(): Promise<IAbuserMongoDoc[] | []>;
  create(data: IAbuserReport): Promise<IAbuserMongoDoc>;
  update(id: string, field: string, change: string | boolean): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
