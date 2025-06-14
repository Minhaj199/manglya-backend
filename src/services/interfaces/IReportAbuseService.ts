import { AbuserReport } from "../../domain/entity/abuseEntiy";

export interface IReportAbuseService {
  checkingDupliacateComplaint(
    id: string,
    reason: string,
    profileId: string
  ): Promise<AbuserReport | null>;
  createReport(
    userId: unknown,
    reporedId: string,
    reason: string,
    moreInfo: string
  ): Promise<boolean>;
  sendWarningMail(
    reporter: string,
    reported: string,
    reportId: string
  ): Promise<boolean>;
  blockReportedUser(
    reporter: string,
    reported: string,
    docId: string
  ): Promise<boolean>;
  getAllMessages(): Promise<[] | AbuserReport[]>;
  rejectReport(
    reporter: string,
    reported: string,
    docId: string
  ): Promise<boolean>;
  toggleReportRead(id: string, status: boolean): Promise<boolean>;
  deleteMessage(id: string): Promise<boolean>;
}