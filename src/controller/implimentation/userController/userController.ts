import { Response, Request, NextFunction } from "express";
import { AppError } from "../../../types/customErrorClass.ts";
import { IOtpService } from "../../../services/interfaces/IOtpService.ts";
import { IParnterService } from "../../../services/interfaces/IPartnerService.ts";
import { IPlanService } from "../../../services/interfaces/IPlanService.ts";
import { IPaymentSerivice } from "../../../services/interfaces/IPaymentService.ts";
import { IFixedDataService } from "../../../services/interfaces/IInterstAndFeatureSerivice.ts";
import { IUserProfileService } from "../../../services/interfaces/IUserProfileService.ts";
import { IReportAbuseService } from "../../../services/interfaces/IReportAbuseService.ts";
import { ResponseMessage } from "../../../constrain/ResponseMessageContrain.ts";
import { HttpStatus } from "../../../constrain/statusCodeContrain.ts";
import { IUserController } from "../../interface/IUserController.ts";
import { userIDValidator } from "../../../utils/userIDValidator.ts";

export class UserController implements IUserController {
  constructor(
    private readonly otpService: IOtpService,
    private readonly reportAbuseService: IReportAbuseService,
    private readonly partnerServiece: IParnterService,
    private readonly userProfileService: IUserProfileService,
    private readonly paymentService: IPaymentSerivice,
    private readonly planService: IPlanService,
    private readonly interestService: IFixedDataService
  ) {}

  otpCreation = async (req: Request, res: Response, next: NextFunction) => {
    const { email, from } = req.body;
    if (from === "forgot") {
      try {
        const response = await this.otpService.otpVerificationForForgot(
          email,
          from
        );
        if (response) {
          if (response) {
            res
              .status(HttpStatus.OK)
              .json({ message: ResponseMessage.EMAIL_SUCCESSFULLY_SEND });
          }
        }
      } catch (error: unknown) {
        next(error);
      }
    } else {
      try {
        const response = await this.otpService.otpVerification(
          email,
          req.body.from
        );
        if (response) {
          res
            .status(HttpStatus.OK)
            .json({ message: ResponseMessage.EMAIL_SUCCESSFULLY_SEND });
        }
      } catch (error: unknown) {
        next(error);
      }
    }
  };

  fetchProfileData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await this.partnerServiece.fetchProfileData(
        req.userID as string,
        req.gender,
        req.preferedGender
      );
      res.json(response);
    } catch (error: unknown) {
      next(error);
    }
  };
  otpForResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!userIDValidator(req.userID)) {
        throw new AppError(ResponseMessage.ID_NOT_FOUND, 404);
      }
      const sentOtp = await this.otpService.otpDispatchingForEditProfile(
        req.userID
      );
      res.json(sentOtp);
    } catch (error) {
      next(error);
    }
  };

  otpValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, otp, from } = req.body;
      const isValid = await this.otpService.otpValidation(email, otp, from);

      if (isValid) {
        res.json({ message: ResponseMessage.OTP_VALID });
      } else {
        res.json({ message: ResponseMessage.OTP_NOT_VALID });
      }
    } catch (error) {
      next(error);
    }
  };

  secondBatch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const obj = await this.userProfileService.signupSecondBatch(
        req.file,
        req.body
      );
      res.json(obj);
    } catch (error: unknown) {
      next(error);
    }
  };
  addMatch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!userIDValidator(req.userID)) {
        throw new AppError(ResponseMessage.ID_NOT_FOUND, 404);
      }
      const response = await this.partnerServiece.addMatch(
        req.userID,
        req.body.matchId
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
  manageReqRes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.partnerServiece.manageReqRes(
        req.body.id,
        req.userID,
        req.body.action
      );
      if (response) {
        res.json({ message: "changed" });
      } else {
        throw new Error("error on request management");
      }
    } catch (error) {
      next(error);
    }
  };
  fetchPlanData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.planService.fetchAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
  purchasePlan = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!userIDValidator(req.userID)) {
        throw new AppError(ResponseMessage.ID_NOT_FOUND, 404);
      }
      if (req.body.planData && req.body.token && req.body.token.email) {
        const response = await this.paymentService.purchase(
          req.body.planData,
          req.body.token,
          req.body.token.email,
          req.userID as string
        );
        res.json({ status: response });
      } else {
        res.json({ message: "client side error" });
      }
    } catch (error) {
      next(error);
    }
  };
  fetchDataForProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.partnerServiece.fetchUserForLandingShow();
      if (response) {
        res.json(response);
      } else {
        throw new Error("Error on new user data collection");
      }
    } catch (error) {
      next(error);
    }
  };
  fetchInterest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.interestService.fetchInterestAsCategory();

      if (response) {
        res.json({ Data: response });
      } else {
        throw new Error("Error on interst getting");
      }
    } catch (error) {
      next(error);
    }
  };
  fetchUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!userIDValidator(req.userID)) {
        throw new AppError(ResponseMessage.ID_NOT_FOUND, 404);
      }
      const { withAge } = await this.userProfileService.fetchUserProfile(
        req.userID
      );
      res.json({ user: withAge });
    } catch (error) {
      next(error);
    }
  };

  otpForUserResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!userIDValidator(req.userID)) {
        throw new AppError(ResponseMessage.ID_NOT_FOUND, 404);
      }
      const validate = await this.otpService.validateOtpForEditProfiel(
        req.userID,
        JSON.stringify(req.body.OTP),
        req.body.from
      );
      res.json({ status: validate });
    } catch (error) {
      next(error);
    }
  };

  editProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.userProfileService.updateProfile(
        req.file,
        req.userID,
        req.body.data
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
  matchedUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!userIDValidator(req.userID)) {
        throw new AppError(ResponseMessage.ID_NOT_FOUND, 404);
      }
      const fetchMatchedUsers = await this.partnerServiece.matchedProfiles(
        req.userID
      );

      if (fetchMatchedUsers) {
        res.json({ fetchMatchedUsers });
      } else {
        res.json(false);
      }
    } catch (error) {
      next(error);
    }
  };
  deleteMatched = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if(!id||typeof id !=='string'){
        throw new Error(ResponseMessage.ID_NOT_FOUND)
      }
      const response = await this.partnerServiece.deleteMatchedUser(
        req.userID,
        id
      );
      res.json({ status: response });
    } catch (error) {
      next(error);
    }
  };
  reportAbuse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.reason || !req.body.moreInfo || !req.body.profileId) {
        throw new Error("In suficient data error");
      }
      const response = await this.reportAbuseService.createReport(
        req.userID,
        req.body.profileId,
        req.body.reason,
        req.body.moreInfo
      );

      if (typeof response === "boolean") {
        res.json({ data: response });
      } else {
        res.json({ data: false });
      }
    } catch (error) {
   
      next(error);
    }
  };
  fetchSuggestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID, preferedGender, gender } = req;
      if (!userID || !preferedGender || !gender) {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
      const result = await this.partnerServiece.fetchSuggestions(
        userID as string,
        preferedGender,
        gender
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  planHistoryAndRequest = async (req: Request, res: Response) => {
    try {
      const response = await this.userProfileService.planHistoryAndRequest(
        req.userID
      );
      res.json(response);
    } catch {
      res.json("error on validating token please login again");
    }
  };
}
