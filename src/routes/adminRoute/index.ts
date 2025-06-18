import { AdminController } from "../../controller/implimentation/adminConntroller/adminController";
import { ReportAbuseController } from "../../controller/implimentation/adminConntroller/reportAbuseController";
import { IAdminController } from "../../controller/interface/IAdminController";
import { PurchasedPlanRepository } from "../../repository/implimention/orderRepository";
import {
  FeaturesRepository,
  InterestRepo,
  TokenRepository,
} from "../../repository/implimention/otherRepository";
import { PlanRepository } from "../../repository/implimention/planRepositories";
import { ReportUserRepository } from "../../repository/implimention/reportUserRepository";
import { UserRepsitories } from "../../repository/implimention/userRepository";
import { AdminAuth } from "../../services/implimentaion/adminAuthService";
import { DashService } from "../../services/implimentaion/adminDashboardService";
import { FixedDataService } from "../../services/implimentaion/InterestAndFeaturesService";
import { PlanService } from "../../services/implimentaion/planService";
import { ReportAbuseService } from "../../services/implimentaion/reportAbuseService";
import { AuthService } from "../../services/implimentaion/userAuthService";
import { UserProfileService } from "../../services/implimentaion/userProfileService";
import { BcryptAdapter } from "../../utils/bcryptAdapter";
import { Cloudinary } from "../../utils/cloudinaryAdapter";
import { EmailService } from "../../utils/emailAdapter";
import { JWTAdapter } from "../../utils/jwtAdapter";
import {
  abuseMessageToggleShema,
  addPlanValidator,
  blockAndUnblockValidator,
  editPlanDtoShema,
  reportAbuseActionValidator,
  reportAbuseRejectShema,
} from "../../dtos/validator/adminValidator";
import { Router } from "express";
import { dtoValidate } from "../../middlewares/dtoValidatorMiddleware";
import { UserProfileRepository } from "../../repository/implimention/userProfileRepository";

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
  planService,
  new UserProfileRepository
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
  addPlanValidator,
  blockAndUnblockValidator,
  editPlanDtoShema,
  reportAbuseActionValidator,
  reportAbuseRejectShema,
  dtoValidate,
  Router
};
