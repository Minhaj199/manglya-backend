import { UserAuthController } from "../../controller/implimentation/userController/authController";
import { MessageController } from "../../controller/implimentation/userController/messageController";
import { UserController } from "../../controller/implimentation/userController/userController";
import { IUserController } from "../../controller/interface/IUserController";
import { ChatRoomRepository } from "../../repository/implimention/chatRepository";
import { MessageRepository } from "../../repository/implimention/messageRepository";
import { PurchasedPlanRepository } from "../../repository/implimention/orderRepository";
import { FeaturesRepository, InterestRepo, TokenRepository } from "../../repository/implimention/otherRepository";
import { OtpRepository } from "../../repository/implimention/otpRepository";
import { PlanRepository } from "../../repository/implimention/planRepositories";
import { ReportUserRepository } from "../../repository/implimention/reportUserRepository";
import { UserRepsitories } from "../../repository/implimention/userRepository";
import { ChatService } from "../../services/implimentaion/chatService";
import { FixedDataService } from "../../services/implimentaion/InterestAndFeaturesService";
import { MessageService } from "../../services/implimentaion/messageService";
import { OtpService } from "../../services/implimentaion/OtpService";
import { PartnerProfileService } from "../../services/implimentaion/partnersProfileService";
import { PaymentSerivice } from "../../services/implimentaion/paymentService";
import { PlanService } from "../../services/implimentaion/planService";
import { ReportAbuseService } from "../../services/implimentaion/reportAbuseService";
import { AuthService } from "../../services/implimentaion/userAuthService";
import { UserProfileService } from "../../services/implimentaion/userProfileService";
import { BcryptAdapter } from "../../utils/bcryptAdapter";
import { Cloudinary } from "../../utils/cloudinaryAdapter";
import { EmailService } from "../../utils/emailAdapter";
import { JWTAdapter } from "../../utils/jwtAdapter";
import { userJwtAuthenticator } from "../../middlewares/jwtUserMiddleware.ts";
import { upload } from "../../config/multerConfig.ts";
import { Router } from "express";
import {
  acceptAndRejectDTOSchema,
  acssTknRenualDTOSchema,
  addMatchDtoSchema,
  createTextsDTOSchema,
  deleteMatchedUser,
  emailDtoSchema,
  firstBatchDataDtoSchema,
  fromValidatorDTOSchema,
  loginDtoSchema,
  messageViewedDTOSchema,
  otpCreationDtoSchema,
  otpDtoSchema,
  passResetProfileDTOSchema,
  passwordResetDTOSchema,
  purchasePlanDTOSchema,
  reportAbuserUserDTOSchema,
  secondBatchDtoSchema,
} from "../../dtos/validator/userDTOs.ts";

const otpService = new OtpService(
  new UserRepsitories(),
  new OtpRepository(),
  new EmailService()
);
export const authService = new AuthService(
  new UserRepsitories(),
  new BcryptAdapter(),
  new JWTAdapter(new TokenRepository())
);
export const partnerServiece = new PartnerProfileService(
  new UserRepsitories(),
  new InterestRepo()
);

const chatRoom = new ChatService(
  new UserRepsitories(),
  new ChatRoomRepository(),
  new MessageService(
    new MessageRepository(),
    new ChatRoomRepository(),
    new Cloudinary(),
    new UserRepsitories()
  ),
  new JWTAdapter(new TokenRepository())
);
export const messageService = new MessageService(
  new MessageRepository(),
  new ChatRoomRepository(),
  new Cloudinary(),
  new UserRepsitories()
);
export const resportAbuserService = new ReportAbuseService(
  new ReportUserRepository(),
  new EmailService(),
  new UserRepsitories()
);
const planService = new PlanService(
  new PlanRepository(),
  new PurchasedPlanRepository()
);
const paymentService = new PaymentSerivice(
  new PurchasedPlanRepository(),
  new UserRepsitories()
);
const interestService = new FixedDataService(
  new InterestRepo(),
  new FeaturesRepository()
);
export const userProfileService = new UserProfileService(
  new PlanRepository(),
  new Cloudinary(),
  new UserRepsitories(),
  authService,
  planService
);

const userController: IUserController = new UserController(
  otpService,
  resportAbuserService,
  partnerServiece,
  userProfileService,
  paymentService,
  planService,
  interestService
);
const messageController=new MessageController(chatRoom,messageService)
const userAuthController=new UserAuthController( authService,otpService)

export {userAuthController,messageController,userController,acceptAndRejectDTOSchema,
  acssTknRenualDTOSchema,
  addMatchDtoSchema,
  createTextsDTOSchema,
  deleteMatchedUser,
  emailDtoSchema,
  firstBatchDataDtoSchema,
  fromValidatorDTOSchema,
  loginDtoSchema,
  messageViewedDTOSchema,
  otpCreationDtoSchema,
  otpDtoSchema,
  passResetProfileDTOSchema,
  passwordResetDTOSchema,
  purchasePlanDTOSchema,
  reportAbuserUserDTOSchema,
  userJwtAuthenticator,
  Router,
  secondBatchDtoSchema,upload
}