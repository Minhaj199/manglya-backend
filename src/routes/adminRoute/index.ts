import { AdminController } from "../../controller/implimentation/adminConntroller/adminController.ts";
import { ReportAbuseController } from "../../controller/implimentation/adminConntroller/reportAbuseController.ts";
import { IAdminController } from "../../controller/interface/IAdminController.ts";
import { PurchasedPlanRepository } from "../../repository/implimention/orderRepository.ts";
import {
  FeaturesRepository,
  InterestRepo,
  TokenRepository,
} from "../../repository/implimention/otherRepository.ts";
import { PlanRepository } from "../../repository/implimention/planRepositories.ts";
import { ReportUserRepository } from "../../repository/implimention/reportUserRepository.ts";
import { UserRepsitories } from "../../repository/implimention/userRepository.ts";
import { AdminAuth } from "../../services/implimentaion/adminAuthService.ts";
import { DashService } from "../../services/implimentaion/adminDashboardService.ts";
import { FixedDataService } from "../../services/implimentaion/InterestAndFeaturesService.ts";
import { PlanService } from "../../services/implimentaion/planService.ts";
import { ReportAbuseService } from "../../services/implimentaion/reportAbuseService.ts";
import { AuthService } from "../../services/implimentaion/userAuthService.ts";
import { UserProfileService } from "../../services/implimentaion/userProfileService.ts";
import { BcryptAdapter } from "../../utils/bcryptAdapter.ts";
import { Cloudinary } from "../../utils/cloudinaryAdapter.ts";
import { EmailService } from "../../utils/emailAdapter.ts";
import { JWTAdapter } from "../../utils/jwtAdapter.ts";
import {
  abuseMessageToggleShema,
  addPlanDtoSchema,
  blockAndUnblockDtoSchema,
  editPlanDtoShema,
  reportAbuseActionDtoSchema,
  reportAbuseRejectShema,
} from "../../dtos/validator/adminDTO.ts";
import { Router } from "express";
import { dtoValidate } from "../../middlewares/dtoValidatorMiddleware.ts";

const adminAuth = new AdminAuth(new JWTAdapter(new TokenRepository()));
const authService = new AuthService(
  new UserRepsitories(),
  new BcryptAdapter(),
  new JWTAdapter(new TokenRepository())
);
const planService = new PlanService(
  new PlanRepository(),
  new PurchasedPlanRepository()
);
const interestAndFeaturesService = new FixedDataService(
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
const dashService = new DashService(
  new UserRepsitories(),
  new PurchasedPlanRepository()
);

const adminController: IAdminController = new AdminController(
  adminAuth,
  planService,
  interestAndFeaturesService,
  userProfileService,
  dashService
);
export const resportAbuserService = new ReportAbuseService(
  new ReportUserRepository(),
  new EmailService(),
  new UserRepsitories()
);

const reportAbuseController = new ReportAbuseController(resportAbuserService);

export {
  adminController,
  reportAbuseController,
  abuseMessageToggleShema,
  addPlanDtoSchema,
  blockAndUnblockDtoSchema,
  editPlanDtoShema,
  reportAbuseActionDtoSchema,
  reportAbuseRejectShema,
  dtoValidate,
  Router
};
