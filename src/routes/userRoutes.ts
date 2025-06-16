
/////////////////// on route shoulb removed///////////


import { Router } from "express";

import { userJwtAuthenticator } from "../middlewares/jwtUserMiddleware.ts";
import { upload } from "../config/multerConfig.ts"; 
import { AuthService } from "../services/implimentaion/userAuthenticationService.ts";
import { Cloudinary } from "../utils/cloudinaryAdapter.ts"; 
import { BcryptAdapter } from "../utils/bcryptAdapter.ts";
import { JWTAdapter } from "../utils/jwtAdapter.ts";
import { EmailService } from "../utils/emailAdapter.ts";
import { PartnerProfileService } from "../services/implimentaion/partnersProfileService.ts";
import { UserProfileService } from "../services/implimentaion/userProfileService.ts";
import { PaymentSerivice } from "../services/implimentaion/paymentService.ts";
import { ReportAbuseService } from "../services/implimentaion/reportAbuseService.ts";
import { ChatService } from "../services/implimentaion/chatService.ts";
import { MessageService } from "../services/implimentaion/messageService.ts";
import { OtpService } from "../services/implimentaion/OtpService.ts";
import { PlanService } from "../services/implimentaion/planService.ts";
import { FixedDataService } from "../services/implimentaion/InterestAndFeaturesService.ts";
import { UserRepsitories } from "../repository/implimention/userRepository.ts";
import { OtpRepository } from "../repository/implimention/otpRepository.ts";
import { FeaturesRepository, InterestRepo, TokenRepository } from "../repository/implimention/otherRepository.ts";
import { PlanRepository } from "../repository/implimention/planRepositories.ts";
import { MessageRepository } from "../repository/implimention/messageRepository.ts";
import { ChatRoomRepository } from "../repository/implimention/chatRepository.ts";
import { ReportUserRepository } from "../repository/implimention/reportUserRepository.ts";
import { PurchasedPlanRepository } from "../repository/implimention/orderRepository.ts";
import { UserController } from "../controller/implimentation/userController.ts";
import { IUserController } from "../controller/interface/IUserController.ts";
import { dtoValidate } from "../middlewares/dtoValidatorMiddleware.ts";
import { firstBatchDataDto } from "../dtos/validator/userDTOs.ts";


const router = Router();


const otpService=new OtpService(new UserRepsitories,new OtpRepository,new EmailService)
export const authService=new AuthService(new UserRepsitories,new BcryptAdapter,new JWTAdapter(new TokenRepository))
export const partnerServiece=new PartnerProfileService(new UserRepsitories,new InterestRepo)

const chatRoom=new ChatService(new UserRepsitories,new ChatRoomRepository,new MessageService(new MessageRepository, new ChatRoomRepository,new Cloudinary,new UserRepsitories),new JWTAdapter(new TokenRepository))
export const messageService=new MessageService(new MessageRepository, new ChatRoomRepository,new Cloudinary,new UserRepsitories)
export const resportAbuserService=new ReportAbuseService(new ReportUserRepository,new EmailService,new UserRepsitories)
const planService=new PlanService(new PlanRepository,new PurchasedPlanRepository)
const paymentService=new PaymentSerivice(new PurchasedPlanRepository,new UserRepsitories)
const interestService=new FixedDataService(new InterestRepo,new FeaturesRepository)
export const userProfileService=new UserProfileService(new PlanRepository,new Cloudinary,new UserRepsitories,authService,planService)
const userController:IUserController=new UserController(otpService,authService,resportAbuserService,partnerServiece,userProfileService,chatRoom,paymentService,messageService,planService,interestService)



router.post("/login", userController.login)
router.post("/firstBatchData",dtoValidate(firstBatchDataDto),userController.signup);
router.get("/fetchforLanding",userController.fetchDataForProfile);
router.post("/otpCreation",userController.otpCreation);
router.post("/otpValidation", userController.otpValidation);
router.patch("/changePassword", userController.changePassword);
router.post("/forgotEmail", userController.forgotCheckValidateSigunp);
router.post("/uploadProfile", upload.single("file"), userController.secondBatch);
router.get("/forgotEmail", userController.forgotCheckValidate);






router.post("/addMatch", userJwtAuthenticator, userController.addMatch);
router.patch("/manageReqRes", userJwtAuthenticator, userController.manageReqRes);
router.get("/fetchProfile", userJwtAuthenticator,userController.fetchProfileData);
router.get("/fetchPlanData", userController.fetchPlanData)
router.post("/purchasePlan", userJwtAuthenticator,userController.purchasePlan);





router.get("/getInterest", userController.fetchInterest);
router.get('/getUserProfile',userJwtAuthenticator,userController.getUserProfile)
router.post('/otpRstPsword',userJwtAuthenticator,userController.otpForResetPassword)
router.post('/validateUserOTP',userJwtAuthenticator,userController.otpForUserResetPassword)
router.patch('/resetPassword',userJwtAuthenticator,userController.resetPassword)
router.delete('/deleteMatched',userJwtAuthenticator,userController.deleteMatched)
router.put('/editProfile',userJwtAuthenticator,upload.single('file'),userController.editProfile)
router.get('/matchedUsers',userJwtAuthenticator,userController.matchedUser)
router.post('/reportAbuse',userJwtAuthenticator,userController.reportAbuse)
router.get('/fetchSuggestion',userJwtAuthenticator,userController.fetchSuggestion)
router.post('/getChats',userJwtAuthenticator,userController.getChats)
router.post('/createChats',userJwtAuthenticator,userController.createTexts)
router.get('/getMessages/:id',userJwtAuthenticator,userController.getMessages)
router.get('/userForChat/:id',userJwtAuthenticator,userController.getuserForChat)
router.get('/countMessages',userJwtAuthenticator,userController.MsgCount)
router.patch('/messageReaded',userJwtAuthenticator,userController.MessageViewed)
router.post('/saveImage',userJwtAuthenticator,upload.single('file'),userController.saveImage)
router.post('/getNewToken',userController.getNewToken)
router.get('/planHistoryAndRequest',userJwtAuthenticator,userController.planHistoryAndRequest)


export default router;
