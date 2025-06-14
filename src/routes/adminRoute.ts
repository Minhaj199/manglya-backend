import { Router } from "express";
import {
    AdminController
} from "../controller/implimentation/adminController.ts";
import { adminJwtAuthenticator } from "../middlewares/jwtAdminMiddleware.ts"; 
import { AdminAuth } from "../services/implimentaion/adminAuthService.ts";
import { JWTAdapter } from "../utils/jwtAdapter.ts";


import { Cloudinary } from "../utils/cloudinaryAdapter.ts";
import { AuthService } from "../services/implimentaion/userAuthenticationService.ts";
import { BcryptAdapter } from "../utils/bcryptAdapter.ts";

import { PlanService } from "../services/implimentaion/planService.ts";
import { FixedDataService } from "../services/implimentaion/InterestAndFeaturesService.ts";
import { DashService } from "../services/implimentaion/adminDashboardService.ts";

import { resportAbuserService } from "./userRoutes.ts";
import { FeaturesRepository, InterestRepo, TokenRepository } from "../repository/implimention/otherRepository.ts";
import { UserRepsitories } from "../repository/implimention/userRepository.ts";
import { PlanRepository } from "../repository/implimention/planRepositories.ts";
import { PurchasedPlanRepository } from "../repository/implimention/orderRepository.ts";
import { UserProfileService } from "../services/implimentaion/userProfileService.ts";
import { IAdminController } from "../controller/interface/IAdminController.ts";


const router=Router()




const adminAuth=new AdminAuth(new JWTAdapter(new TokenRepository))
const authService=new AuthService(new UserRepsitories,new BcryptAdapter,new JWTAdapter(new TokenRepository))
const planService=new PlanService(new PlanRepository ,new PurchasedPlanRepository)
const interestAndFeaturesService=new FixedDataService(new InterestRepo,new FeaturesRepository)
export const userProfileService=new UserProfileService(new PlanRepository,new Cloudinary,new UserRepsitories,authService)
const dashService=new DashService(new UserRepsitories,new PurchasedPlanRepository)


const adminController:IAdminController=new AdminController(adminAuth,planService,interestAndFeaturesService,userProfileService,dashService,resportAbuserService)
router.post('/login',adminController.login)




//fetch data to user table
router.get('/fetchUserData',adminJwtAuthenticator,adminController.fetechData)
router.get('/fetchPlanData',adminJwtAuthenticator,adminController.fetechPlanData)
router.patch('/block&Unblock',adminJwtAuthenticator,adminController.userBlockAndUnblock)
router.post('/insertPlan',adminJwtAuthenticator,adminController.addPlan)
router.put('/editPlan',adminJwtAuthenticator,adminController.editPlan)
router.patch('/removePlan',adminJwtAuthenticator,adminController.softDlt)
router.get('/fetchFeature',adminJwtAuthenticator,adminController.fetchFeature)
router.get('/getDataToDash',adminJwtAuthenticator,adminController.fetchDashData)
router.patch('/sendWarningMale',adminJwtAuthenticator,adminController.sendWarningMails)
router.patch('/blockAbuser',adminJwtAuthenticator,adminController.blockAbuser)
router.get('/getReports',adminJwtAuthenticator,adminController.getReports)
router.patch('/rejecReport',adminJwtAuthenticator,adminController.rejecReport)
router.patch('/reportToggle',adminJwtAuthenticator,adminController.reportToggle)
router.delete('/deleteMsg',adminJwtAuthenticator,adminController.deleteMsg)




export default router 
