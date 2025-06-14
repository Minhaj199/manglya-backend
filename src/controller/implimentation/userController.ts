import { Response, Request, NextFunction } from "express";
import { AppError } from "../../types/customErrorClass.ts";
import { User } from "../../types/UserRelatedTypes.ts"; 
import { IOtpService } from "../../services/interfaces/IOtpService.ts"; 
import { IParnterService } from "../../services/interfaces/IPartnerService.ts";
import { IChatService } from "../../services/interfaces/IChatService.ts";
import { IPlanService } from "../../services/interfaces/IPlanService.ts";
import { IPaymentSerivice } from "../../services/interfaces/IPaymentService.ts";
import { IFixedDataService } from "../../services/interfaces/IInterstAndFeatureSerivice.ts";
import { IAuthSevice } from "../../services/interfaces/IAuthSerivce.ts";
import { IUserProfileService } from "../../services/interfaces/IUserProfileService.ts";
import { IMessageService } from "../../services/interfaces/IMessageSerivice.ts";
import { IReportAbuseService } from "../../services/interfaces/IReportAbuseService.ts";
import { ResponseMessage } from "../../contrain/ResponseMessageContrain.ts";
import { HttpStatus } from "../../contrain/statusCodeContrain.ts";
import { IUserController } from "../interface/IUserController.ts";

export class UserController implements IUserController {

  constructor(
     private otpService: IOtpService,
    private authService: IAuthSevice,
    private reportAbuseService: IReportAbuseService,
    private partnerServiece: IParnterService,
    private userProfileService: IUserProfileService,
    private chatRoomService: IChatService,
    private paymentService: IPaymentSerivice,
    private messageService: IMessageService,
     private  planService: IPlanService,
    private interestService: IFixedDataService
  ) {}
  signup = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const user:{user:User,token:string,refreshToken:string} = await this.authService.signupFirstBatch(req.body);     
      res.setHeader("authorizationforuser", user?.refreshToken);
      res.status(HttpStatus.CREATED).json({ message: ResponseMessage.USER_CREATION_SUCCESS, token: user?.token });

      
    } catch (error: unknown) {
     next(error)
    }
  };
  otpCreation = async (req: Request, res: Response,next:NextFunction) => {
    const { email, from } = req.body;
    if (from === "forgot") {
      try {
        const response = await this.otpService.otpVerificationForForgot(
          email,
          from
        );
        if (response) {
          if (response) {
            res.status(HttpStatus.OK).json({ message: ResponseMessage.EMAIL_SUCCESSFULLY_SEND });
          }
        }
      } catch (error: unknown) {
         next(error)
      }
    } else {
      try {
        const response = await this.otpService.otpVerification(
          email,
          req.body.from
        );
        if (response) {
          res.status(HttpStatus.OK).json({ message: ResponseMessage.EMAIL_SUCCESSFULLY_SEND });
        }
      } catch (error: unknown) {
       next(error)
      }
    }
  };
  login = async (req: Request, res: Response,next:NextFunction) => {
    const { email, password } = req.body;

    try {
      const response = await this.authService.login(email, password);

      const {
        token,
        refresh,
        name,
        photo,
        partner,gender,subscriptionStatus,} = response;
      res.setHeader("authorizationforuser", refresh);

      res.status(HttpStatus.OK).json({
        message: "password matched",
        token,
        refresh,
        name,
        photo,
        partner,
        gender,
        subscriptionStatus,
      });
    } catch (error: unknown) {
      next(error)
    }
  };
  fetchProfileData = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const response = await this.partnerServiece.fetchProfileData(
          req.userID as string,
          req.gender,
          req.preferedGender
        );
        res.json(response);
    } catch (error: unknown) {
      next(error)
    }
  };
  forgotCheckValidate = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
        const response = await this.otpService.otpVerificationForForgot(
            req.query.email,
            "forgot"
          );
          if(response){
             res.json({ email:req.query.email });
          }else{
            
            res.status(HttpStatus.OK).json(response)
          }
    } catch (error) {
      next(error);
    }
  };
  forgotCheckValidateSigunp = async (
    req: Request,
    res: Response,
    next:NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;

      const isValid = await this.otpService.ForgetValidateEmail(email);

      if (isValid) {
        res.json({ email: isValid.email });
      } else {
        res.json(false);
      }
    } catch (error) {
      next(error);
    }
  };
  otpValidation = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      const { email, otp, from } = req.body;
      const isValid = await this.otpService.otpValidation(email, otp, from);

      if (isValid) {
        res.json({ message:ResponseMessage.OTP_VALID });
      } else {
        res.json({ message:ResponseMessage.OTP_NOT_VALID});
      }
    } catch (error) {
      next(error);
    }
  };
  changePassword = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      const { password, email } = req.body;
      const isValid = await this.authService.passwordChange(email, password);
      if (isValid) {
        res.json({ message: "password changed" });
      } else {
        res.json({ message: "error on password" });
      }
    } catch (error) {
      next(error);
    }
  };
  secondBatch = async (req: Request, res: Response,next:NextFunction): Promise<void> => {

    try {
      const obj=await this.userProfileService.signupSecondBatch(req.file,req.body)
      res.json(obj);
    } catch (error: unknown) {
      next(error);
    }
  };
  addMatch = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      const response = await this.partnerServiece.addMatch(
        req.userID,
        req.body.matchId
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
  manageReqRes = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
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
  fetchPlanData = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      const data = await this.planService.fetchAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
  purchasePlan = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      if (!req.userID) {
        throw new Error("user id not found");
      }
      if (req.body.planData && req.body.token && req.body.token.email) {
        const response = await this.paymentService.purchase(
          req.body.planData,
          req.body.token,
          req.body.token.email,
          req.userID
        );
        res.json({ status: response });
      } else {
        res.json({ message: "client side error" });
      }
    } catch (error) {
      next(error);
    }
  };
  fetchDataForProfile = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      const response = await this.partnerServiece.fetchUserForLandingShow();
      if (response) {
        res.json(response);
      } else {
        throw new Error("Error on new user data collection");
      }
    } catch (error) {
      next(error)
    }
  };
  fetchInterest = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
      const response = await this.interestService.fetchInterestAsCategory();

      if (response) {
        res.json({ Data: response });
      } else {
        throw new Error("Error on interst getting");
      }
    } catch (error) {
      next(error)
    }
  };
  getUserProfile = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const user = await this.userProfileService.fetchUserProfile(req.userID);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  };
  otpForResetPassword = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const sentOtp = await this.otpService.otpDispatchingForEditProfile(
        req.userID
      );
      res.json(sentOtp);
    } catch (error) {
      next(error)
    }
  };
  otpForUserResetPassword = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const validate = await this.otpService.validateOtpForEditProfiel(req.userID,JSON.stringify(req.body.OTP),req.body.from
      );
      res.json({ status: validate });
    } catch (error) {
     next(error)
    }
  };
  resetPassword = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const { password, confirmPassword } = req.body;
        const response = await this.authService.changePasswordEditProfile(
          password,
          confirmPassword,
          req.userID
        );
        res.json({ status: response });
    } catch (error) {
      if(error instanceof Error){
        const err=new  AppError(500,error.message)
        next(err)
      }

    }
  };
  editProfile = async (req: Request, res: Response,next:NextFunction) => {
    try {
      if (req.file) {
        const email = await this.userProfileService.fetchUserByID(req.userID);
        await this.userProfileService.uploadPhoto(req.file.path, email);
        const updateDetail = await this.userProfileService.updateEditedData(
          JSON.parse(req.body.data),
          req.userID
        );
        res.json({ status: true, newData: updateDetail });
      } else {
        const updateDetail = await this.userProfileService.updateEditedData(
          JSON.parse(req.body.data),
          req.userID
        );
        if (typeof updateDetail === "string") {
          res.json({ newData: updateDetail });
        } else {
          res.json({ newData: updateDetail });
        }
      }
    } catch (error) {
      
      next(error)
    }
  };
  matchedUser = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const fetchMatchedUsers = await this.partnerServiece.matchedProfiles(
        req.userID
      );

      if (fetchMatchedUsers) {
        res.json({ fetchMatchedUsers });
      } else {
        res.json(false);
      }
    } catch (error) {
      next(error)
    }
  };
  deleteMatched = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const { id } = req.body;

      const response = await this.partnerServiece.deleteMatchedUser(
        req.userID,
        id
      );
      res.json({ status: response });
    } catch (error) {
     next(error)
    }
  };
  reportAbuse = async (req: Request, res: Response,next:NextFunction) => {
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
      next(error)
    }
  };
  fetchSuggestion = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const result = await this.partnerServiece.fetchSuggestions(
        req.userID as string,
        req.preferedGender,
        req.gender
      );
      res.json(result);
    } catch (error) {
      next(error)
    }
  };
  getChats = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const response = await this.chatRoomService.fetchChats(req.body.id, req.userID);

      res.json(response);
    } catch (error) {
      next(error)
    }
  };
  createTexts = async (req: Request, res: Response,next:NextFunction) => {
    try {
      if (req.body.chatId === "") {
        throw new Error("chat id not found");
      }

      const response = await this.chatRoomService.createMessage(
        req.body.chatId,
        req.body.senderIdString,
        req.body.receiverId,
        req.body.text,
        req.body.image
      );
      res.json({ newMessage: response });
    } catch (error) {
      next(error)
    }
  };
  getMessages = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const response = await this.messageService.findAllMessage(req.params.id);
      res.json(response);
    } catch (error) {
     next(error)
    }
  };
  getuserForChat = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const response = await this.chatRoomService.fetchUserForChat(req.params.id);
      res.json(response);
    } catch (error) {
      next(error)
    }
  };
  MsgCount = async (req: Request, res: Response) => {
    try {
      const newMessagesForNav = await this.messageService.fetchMessageCount(
        req.query?.from,
        req.userID
      );
      const newMessagesNotifiation = await this.messageService.findNewMessages(
        req.userID
      );

      res.json({ newMessagesForNav, newMessagesNotifiation });
    } catch  {
     
        res.json({ count: 0 });
     
    }
  };
  MessageViewed = async (req: Request, res: Response) => {
    try {
      const response = await this.messageService.makeAllUsersMessageReaded(
        req.body.from,
        req.body.ids
      );
      res.json({ status: response });
    } catch  {
      res.json({ status: false });
    }
  };
  saveImage = async (req: Request, res: Response) => {
    try {
      if (req.file && typeof req.file.path === "string") {
        const getImgUrl = await this.messageService.createImageUrl(
          req.file.path
        );
        res.json({ image: getImgUrl });
      } else {
        throw new Error("internal server error on photo send");
      }
    } catch  {
      res.json({ status: false });
    }
  };

  getNewToken = async (req: Request, res: Response) => {
    try {
      console.log('here')
      const response = await this.authService.getNewToken(req.body.refresh);
      if (response) {
        console.log(response)
        res.status(200).json({ token: response });
      } else {
        throw new Error("refresh token not found");
      }
    } catch(err) {
      console.log(err)
      res.status(400).json("error on validating token please login again");
    }
  };
  planHistoryAndRequest = async (req: Request, res: Response) => {
    const id = req.userID;

    try {
      if (typeof id !== "string") {
        throw new Error("id not found");
      }
      const response = await this.userProfileService.findCurrentPlanAndRequests(
        id
      );
      const history = await this.planService.fetchHistory(id);
      console.log(response)
      res.json({ ...response, history });
    
    } catch  {
      res.json("error on validating token please login again");
    }
  };
}
