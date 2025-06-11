import { Router } from "express";

import {
  secondBatch,
  forgotCheckValidateSigunp,
  signup,
  login,
  forgotCheckValidate,
  otpCreation,
  otpValidation,
  changePassword,
  fetechProfileData,
  fetchPlanData,
  addMatch,
  manageReqRes,
  purchasePlan,
  fetchDataForProfile,
  fetchInterest,
  getUserProfile,
  otpForResetPassword,
  otpForUserResetPassword,
  resetPassword,
  editProfile,
  matchedUser,
  deleteMatched,
  reportAbuse,
  fetchSuggestion,
  getChats,
  getMessages,
  createTexts,
  getuserForChat,
  MsgCount,
  MessageViewed,
 
  saveImage,
  getNewToken,
  planHistoryAndRequest,
 
} from "../controller/userCtrl.ts";


import { userJwtAuthenticator } from "../middlewares/jwtUser.ts";
import { upload } from "../utility/multer.ts";
import { UserRepsitories } from "../../infrastructure/repositories/userRepository.ts"; 
import { PurchasedPlan } from "../../infrastructure/repositories/orderRepository.ts";
import { OtpRepository } from "../../infrastructure/repositories/otpRepository.ts";
import { FeaturesRepository, InterestRepo, TokenRepository } from "../../infrastructure/repositories/otherRepo.ts";
import { ReportUser } from "../../infrastructure/repositories/reportUser.ts";
import { ChatRoomRepository } from "../../infrastructure/repositories/chatRepository.ts";
import { MessageRepository } from "../../infrastructure/repositories/messageRepository.ts";
import { PlanRepository } from "../../infrastructure/repositories/planRepositories.ts"; 
import { AuthService } from "../../application/services/authService.ts";
import { Cloudinary } from "../utility/cloudinary.ts"; 
import { BcryptAdapter } from "../../infrastructure/bcryptAdapter.ts";
import { JWTAdapter } from "../../infrastructure/jwt.ts";
import { EmailService } from "../utility/emailService.ts";
import { PartnerProfileService } from "../../application/services/partnersProfileService.ts";
import { UserProfileService } from "../../application/services/userService.ts";
import { PaymentSerivice } from "../../application/services/paymentService.ts";
import { ReportAbuseService } from "../../application/services/reportAbuseService.ts";
import { ChatService } from "../../application/services/chatService.ts";
import { MessageService } from "../../application/services/messageServie.ts";
import { OtpService } from "../../application/services/OtpService.ts";
import { PlanService } from "../../application/services/planService.ts";
import { FixedDataService } from "../../application/services/InterestAndFeatures.ts";
const router = Router();


const otpService=new OtpService(new UserRepsitories,new OtpRepository,new EmailService)
export const authService=new AuthService(new UserRepsitories,new BcryptAdapter,new JWTAdapter(new TokenRepository))


export const partnerServiece=new PartnerProfileService(new UserRepsitories,new InterestRepo)
export const userProfileService=new UserProfileService(new PlanRepository,new Cloudinary,new UserRepsitories,authService)
const chatRoom=new ChatService(new UserRepsitories,new ChatRoomRepository,new MessageService(new MessageRepository, new ChatRoomRepository,new Cloudinary,new UserRepsitories),new JWTAdapter(new TokenRepository))
export const messageService=new MessageService(new MessageRepository, new ChatRoomRepository,new Cloudinary,new UserRepsitories)
export const resportAbuserService=new ReportAbuseService(new ReportUser,new EmailService,new UserRepsitories)
const planService=new PlanService(new PlanRepository,new PurchasedPlan)
const paymentService=new PaymentSerivice(new PurchasedPlan,new UserRepsitories)
const interestService=new FixedDataService(new InterestRepo,new FeaturesRepository)


router.post("/login",(req,res)=>  login(req,res,authService))
router.post("/firstBatchData",(req,res)=> signup(req,res,authService));
router.get("/fetchforLanding",(req,res)=>fetchDataForProfile(req,res,partnerServiece));
router.post("/otpCreation",(req,res)=>otpCreation(req,res,authService,otpService));
router.post("/otpValidation",(req,res)=> otpValidation(req,res,otpService));
router.patch("/changePassword",(req,res)=> changePassword(req,res,authService));
router.post("/forgotEmail", (req,res)=>forgotCheckValidateSigunp(req,res,otpService));
router.post("/uploadProfile", upload.single("file"),(req,res)=> secondBatch(req,res,userProfileService));
router.get("/forgotEmail",(req,res)=> forgotCheckValidate(req,res,otpService));
router.post("/addMatch", userJwtAuthenticator,(req,res)=> addMatch(req,res,partnerServiece));
router.patch("/manageReqRes", userJwtAuthenticator,(req,res)=> manageReqRes(req,res,partnerServiece));
router.get("/fetchProfile", userJwtAuthenticator,(req,res)=>fetechProfileData(req,res,partnerServiece));
router.get("/fetchPlanData",(req,res)=> fetchPlanData(req,res,planService))
router.post("/purchasePlan", userJwtAuthenticator,(req,res)=>purchasePlan(req,res,paymentService));
router.get("/getInterest",(req,res)=> fetchInterest(req,res,interestService));
router.get('/getUserProfile',userJwtAuthenticator,(req,res)=>getUserProfile(req,res,userProfileService) )
router.post('/otpRstPsword',userJwtAuthenticator,(req,res)=>otpForResetPassword(req,res,otpService))
router.post('/validateUserOTP',userJwtAuthenticator,(req,res)=>otpForUserResetPassword(req,res,otpService))
router.patch('/resetPassword',userJwtAuthenticator,(req,res)=>resetPassword(req,res,authService))
router.delete('/deleteMatched',userJwtAuthenticator,(req,res)=>deleteMatched(req,res,partnerServiece))
router.put('/editProfile',userJwtAuthenticator,upload.single('file'),(req,res)=>editProfile(req,res,userProfileService))
router.get('/matchedUsers',userJwtAuthenticator,(req,res)=>matchedUser(req,res,partnerServiece))
router.post('/reportAbuse',userJwtAuthenticator,(req,res)=>reportAbuse(req,res,resportAbuserService))
router.get('/fetchSuggestion',userJwtAuthenticator,(req,res)=>fetchSuggestion(req,res,partnerServiece))
router.post('/getChats',userJwtAuthenticator,(req,res)=>getChats(req,res,chatRoom))
router.post('/createChats',userJwtAuthenticator,(req,res)=>createTexts(req,res,chatRoom))
router.get('/getMessages/:id',userJwtAuthenticator,(req,res)=>getMessages(req,res,messageService))
router.get('/userForChat/:id',userJwtAuthenticator,(req,res)=>getuserForChat(req,res,chatRoom))
router.get('/countMessages',userJwtAuthenticator,(req,res)=>MsgCount(req,res,messageService))
router.patch('/messageReaded',userJwtAuthenticator,(req,res)=>MessageViewed(req,res,messageService))
router.post('/saveImage',userJwtAuthenticator,upload.single('file'),(req,res)=>saveImage(req,res,messageService))
router.post('/getNewToken',(req,res)=>getNewToken(req,res,authService))
router.get('/planHistoryAndRequest',userJwtAuthenticator,(req,res)=>planHistoryAndRequest(req,res,userProfileService,planService))


export default router;
