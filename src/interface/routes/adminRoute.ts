import { Router } from "express";
import { login,fetechData,
    fetchFeature,
    userBlockAndUnblock,
    addPlan,
    fetechPlanData,editPlan,
    softDlt,
    fetchDashData,
    sendWarningMails,
    getReports,
    blockAbuser,
    rejecReport,
    reportToggle,
    deleteMsg
} from "../controller/adminCtrl.js";
import { adminJwtAuthenticator } from "../middlewares/jwtAdmin.js";
import { AdminAuth } from "../../application/services/adminAuthService.js";
import { JWTAdapter } from "../../Infrastructure/jwt.js";

import { UserRepsitories } from "../../Infrastructure/repositories/userRepository.js";

import { UserProfileService } from "../../application/services/userService.js";
import { Cloudinary } from "../utility/cloudinary.js";
import { AuthService } from "../../application/services/authService.js";
import { BcryptAdapter } from "../../Infrastructure/bcryptAdapter.js";
import { PlanRepository } from "../../Infrastructure/repositories/planRepositories.js";
import { PlanService } from "../../application/services/planService.js";
import { FixedDataService } from "../../application/services/InterestAndFeatures.js";
import { FeaturesRepository, InterestRepo, TokenRepository } from "../../Infrastructure/repositories/otherRepo.js";
import { DashService } from "../../application/services/adminDashService.js";
import { PurchasedPlan } from "../../Infrastructure/repositories/orderRepository.js";
import { resportAbuserService } from "./userRoutes.js";
const router=Router()
const adminAuth=new AdminAuth(new JWTAdapter(new TokenRepository))
const authService=new AuthService(new UserRepsitories,new BcryptAdapter,new JWTAdapter(new TokenRepository))
const planService=new PlanService(new PlanRepository ,new PurchasedPlan)
const interestAndFeaturesService=new FixedDataService(new InterestRepo,new FeaturesRepository)
export const userProfileService=new UserProfileService(new PlanRepository,new Cloudinary,new UserRepsitories,authService)
const dashService=new DashService(new UserRepsitories,new PurchasedPlan)
router.post('/login',(req,res)=>login(req,res,adminAuth))

//fetch data to user table
router.get('/fetchUserData',adminJwtAuthenticator,(req,res)=>fetechData(req,res,userProfileService ))
router.get('/fetchPlanData',adminJwtAuthenticator,(req,res)=>fetechPlanData(req,res,planService))
router.patch('/block&Unblock',adminJwtAuthenticator,(req,res)=>userBlockAndUnblock(req,res,userProfileService))
router.post('/insertPlan',adminJwtAuthenticator,(req,res)=>addPlan(req,res,planService))
router.put('/editPlan',adminJwtAuthenticator,(req,res)=>editPlan(req,res,planService))
router.patch('/removePlan',adminJwtAuthenticator,(req,res)=>softDlt(req,res,planService))
router.get('/fetchFeature',adminJwtAuthenticator,(req,res)=>fetchFeature(req,res,interestAndFeaturesService))
router.get('/getDataToDash',adminJwtAuthenticator,(req,res)=>fetchDashData(req,res,dashService))
router.patch('/sendWarningMale',adminJwtAuthenticator,(req,res)=>sendWarningMails(req,res,resportAbuserService))
router.patch('/blockAbuser',adminJwtAuthenticator,(req,res)=>blockAbuser(req,res,resportAbuserService))
router.get('/getReports',adminJwtAuthenticator,(req,res)=>getReports(req,res,resportAbuserService))
router.patch('/rejecReport',adminJwtAuthenticator,(req,res)=>rejecReport(req,res,resportAbuserService))
router.patch('/reportToggle',adminJwtAuthenticator,(req,res)=>reportToggle(req,res,resportAbuserService))
router.delete('/deleteMsg',adminJwtAuthenticator,(req,res)=>deleteMsg(req,res,resportAbuserService))




export default router 
// router.get('/checkToken',tokenAuthenticated)