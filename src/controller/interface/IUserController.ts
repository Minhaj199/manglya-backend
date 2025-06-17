import { Request, Response, NextFunction } from "express";


export interface IMessageController{
getChats(req: Request, res: Response, next: NextFunction): Promise<void>;
  createTexts(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserForChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  MsgCount(req: Request, res: Response, next: NextFunction): Promise<void>;
  MessageViewed(req: Request, res: Response, next: NextFunction): Promise<void>;
  saveImage(req: Request, res: Response, next: NextFunction): Promise<void>;
 
}










export interface IAuthController{
signup (req: Request, res: Response, next: NextFunction): Promise<void>;
   login(req: Request, res: Response, next: NextFunction): Promise<void>;  
   forgotCheckValidate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  forgotCheckValidateSigunp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
   resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    getNewToken(req: Request, res: Response, next: NextFunction): Promise<void>;
}


export interface IUserController {
  
  otpCreation(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  fetchProfileData(req: Request,res: Response,next: NextFunction
  ): Promise<void>;
  otpValidation(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  secondBatch(req: Request, res: Response, next: NextFunction): Promise<void>;
  addMatch(req: Request, res: Response, next: NextFunction): Promise<void>;
  manageReqRes(req: Request, res: Response, next: NextFunction): Promise<void>;
  fetchPlanData(req: Request, res: Response, next: NextFunction): Promise<void>;
  purchasePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
  

  fetchDataForProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  fetchInterest(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  otpForResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  otpForUserResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
 
  editProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  matchedUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteMatched(req: Request, res: Response, next: NextFunction): Promise<void>;
  reportAbuse(req: Request, res: Response, next: NextFunction): Promise<void>;
  fetchSuggestion(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  
  planHistoryAndRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
