import { Types } from "mongoose";
import { IAbuserReport } from "../../types/TypesAndInterfaces.ts"; 
import { IReportAbuseService } from "../interfaces/IReportAbuseService.ts"; 
import { IUserRepository } from "../../repository/interface/IUserRepository.ts";
import { IEmailService } from '../../types/TypesAndInterfaces.ts'; 
import { IReportAbuserRepository } from "../../repository/interface/IAbuseRepository.ts";
export class ReportAbuseService implements IReportAbuseService {
  private reportRepo: IReportAbuserRepository;
  private emailService : IEmailService
  private userRepo :IUserRepository

  constructor(
    reportRepo: IReportAbuserRepository,
    emailService: IEmailService,
    userRepo: IUserRepository
  ) {
    this.reportRepo = reportRepo;
    this.emailService = emailService;
    this.userRepo = userRepo;
  }

  async checkingDupliacateComplaint(
    id: string,
    reason: string,
    profileId: string
  ) {
    try {
      const check: IAbuserReport | null = await this.reportRepo.findComplain(
        id,
        reason,
        profileId
      );
      return check;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async createReport(
    userId: unknown,
    reporedId: string,
    reason: string,
    moreInfo: string
  ) {
    try {
      if (typeof userId === "string" && typeof reporedId === "string") {
        const isDuplicate = await this.checkingDupliacateComplaint(
          userId,
          reason,
          reporedId
        );

        if (!isDuplicate) {
          const data: IAbuserReport = {
            reporter: new Types.ObjectId(userId),
            reported: new Types.ObjectId(reporedId),
            reason,
            moreInfo,
            rejected: false,
            block: false,
            read: false,
            warningMail: false,
          };
          const response = await this.reportRepo.create(data);
          if (response) {
            return true;
          } else {
            throw new Error("internal server error");
          }
        } else {
          throw new Error("complaint already taken on specified reason");
        }
      } else {
        throw new Error("type miss match on ids");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async sendWarningMail(reporter: string, reported: string, reportId: string) {
    try {
      const reportedEmail: { email: string } | null =
        await this.userRepo.findEmailByID(reported);
      const reporterEmail: { email: string } | null =
        await this.userRepo.findEmailByID(reporter);
      if (!reportedEmail?.email || !reporterEmail.email) {
        throw new Error("In sufficient data");
      }
      const matter = `Dear user,
         this warning male from mangalya matrimonial. You have been reported for abusive acts,please do keep our guid lines
         `;
      const matterToReporter = `Dear user,
          Sorry to hear that you got bad experience from another user,we took action the abuser took action in your case`;
      await this.emailService.sendEmail(
        reportedEmail.email,
        "warning male from mangalya",
        matter
      );
      await this.emailService.sendEmail(
        reporterEmail.email,
        "Problem Resolve-mangalya",
        matterToReporter
      );
      const response = await this.reportRepo.update(
        reportId,
        "warningMail",
        true
      );

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async blockReportedUser(reporter: string, reported: string, docId: string) {
    try {
      const reportedEmail: { email: string } | null =
        await this.userRepo.findEmailByID(reported);
      const reporterEmail: { email: string } | null =
        await this.userRepo.findEmailByID(reporter);
      if (!reportedEmail?.email || !reporterEmail.email)
        throw new Error("in sufficient data");
      const matter = `Dear user,
             this warning male from mangalya matrimonial. You have been reported from abusive acts,your account suspended till further update
             `;
      await this.emailService.sendEmail(
        reportedEmail.email,
        "warning male from mangalya",
        matter
      );
      await this.emailService.sendEmail(
        reporterEmail.email,
        "Problem Resolve-mangalya",
        matter
      );
      const response = await this.reportRepo.update(docId, "block", true);

      await this.userRepo.blockAndUnblockUser(reported, true);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async getAllMessages() {
    try {
      const response = await this.reportRepo.getMessages();
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async rejectReport(reporter: string, reported: string, docId: string) {
    try {
      const reporterEmail: { email: string } | null =
        await this.userRepo.findEmailByID(reporter);
      if (!reporterEmail.email) {
        throw new Error("in sufficient data");
      }
      const matterToReporter = `Dear user,
      Sorry to hear that you got bad experience for another user,after thorough checking that,
      the specifed user not violated any guidelines,please connect us,strill you feeling any disconfort`;

      await this.emailService.sendEmail(
        reporterEmail.email,
        "Problem Resolve-mangalya",
        matterToReporter
      );
      const response = await this.reportRepo.update(docId, "rejected", true);
      await this.reportRepo.update(docId, "block", true);
      await this.reportRepo.update(docId, "warningMail", true);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async toggleReportRead(id: string, status: boolean) {
    try {
      const response = await this.reportRepo.update(id, "read", status);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async deleteMessage(id: string) {
    try {
      const response = await this.reportRepo.delete(id);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
}
