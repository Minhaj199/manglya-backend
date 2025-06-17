import { NextFunction, Request, Response } from "express";
import { IReportAbuseController } from "../../interface/IAdminController";
import { IReportAbuseService } from "../../../services/interfaces/IReportAbuseService";

export class ReportAbuseController implements IReportAbuseController {
  constructor(private resportAbuserService: IReportAbuseService) {}

  sendWarningMails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sendWarningMale = await this.resportAbuserService.sendWarningMail(
        req.body.reporter,
        req.body.reported,
        req.params.id
      );
      res.json({ data: sendWarningMale });
    } catch (error) {
      next(error);
    }
  };
  fetchReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { messagesDatas } =
        await this.resportAbuserService.getAllMessages();
      res.json({ data: messagesDatas });
    } catch (error: unknown) {
      next(error);
    }
  };
  blockAbuser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fetchReport = await this.resportAbuserService.blockReportedUser(
        req.body.reporter,
        req.body.reported,
        req.params.id
      );
      res.json({ data: fetchReport });
    } catch (error: unknown) {
      next(error);
    }
  };
  rejecReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fetchReport = await this.resportAbuserService.rejectReport(
        req.body.reporter,
        req.body.reported,
        req.params.id
      );
      res.json({ data: fetchReport });
    } catch (error: unknown) {
      next(error);
    }
  };
  reportToggle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fetchReport = await this.resportAbuserService.toggleReportRead(
        req.params.id,
        req.body.status
      );
      res.json({ data: fetchReport });
    } catch (error) {
      next(error);
    }
  };
  deleteMsg = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.resportAbuserService.deleteMessage(
        req.params.id
      );
      res.json({ data: response });
    } catch (error) {
      next(error);
    }
  };
}
