import { Request, Response } from "express";
import { ISubscriptionPlan } from "../../types/TypesAndInterfaces.ts"; 
import { IAdminAuthService } from "../../services/interfaces/IAaminAuthenticationServices.ts";
import { IUserProfileService } from "../../services/interfaces/IUserProfileService.ts";
import { IPlanService } from "../../services/interfaces/IPlanService.ts";
import { ResponseMessage } from "../../contrain/ResponseMessageContrain.ts";
import { IFixedDataService } from "../../services/interfaces/IInterstAndFeatureSerivice.ts";
import { IAdminDashService } from "../../services/interfaces/IAdminDashboardService.ts";
import { IReportAbuseService } from "../../services/interfaces/IReportAbuseService.ts"; 
import { IAdminController } from "../interface/IAdminController.ts";

export class AdminController implements IAdminController {
  constructor(
  private adminAuth: IAdminAuthService,
  private planService: IPlanService,
  private interestAndFeaturesService: IFixedDataService,
  private userProfileService: IUserProfileService,
  private dashService: IAdminDashService,
  private resportAbuserService: IReportAbuseService,
  ) {}
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const isValid = this.adminAuth.login(email, password);

      if (isValid?.message === "admin verified") {
        res.json({ adminVerified: true, token: isValid.token });
      } else if (isValid?.message === "password not matching") {
        res.json({ password: isValid.message });
      } else if (isValid?.message === "user name not found") {
        res.json({ username: "user name not found" });
      }
    } catch (error: unknown) {
      if(error instanceof Error){
        if (error.message === "user name not found") {
          res.json({ username: error.message });
        }
        if (error.message === "password not matching") {
          res.json({ password: error.message });
        }
      }else{
        
          res.json({ password:'internal server error'  });
        
      }
    }
  };
  fetechData = async (req: Request, res: Response) => {
    try {
      if (req.query.from && req.query.from === "subscriber") {
        const getSubscriberData =
          await this.userProfileService.fetchSubscriberDetailforAdmin();

        res.json(getSubscriberData);
      } else if (req.query.from && req.query.from === "user") {
        const processedData = await this.userProfileService.fetchUserDatasForAdmin();
        res.json(processedData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  userBlockAndUnblock = async (req: Request, res: Response) => {
    try {
      const response = await this.userProfileService.blockAndBlock(
        req.body.id,
        req.body.updateStatus
      );

      if (response) {
        res.json({ message: "updated" });
      } else {
        throw new Error("error on updation");
      }
    } catch (error) {
      console.log(error);
    }
  };
  addPlan = async (req: Request, res: Response) => {
    try {
      const plan: ISubscriptionPlan = {
        name: req.body.datas.name,
        features: req.body.handleFeatureState,
        amount: req.body.datas.amount,
        connect: req.body.datas.connect,
        duration: parseInt(req.body.datas.duration),
      };
      const response = await this.planService.createPlan(plan);
      res.json({ status: response });
    } catch (error: unknown) {
      if(error instanceof Error){
        res.json({ message: error.message });
      }else{
        
        res.json({ message: 'unexpected error' });
      }
    }
  };

  fetechPlanData = async (req: Request, res: Response) => {
    try {
      const plans = await this.planService.fetchAll();

      res.json({ plans });
    } catch (error: unknown) {
      
       if(error instanceof Error){
        res.json({ message: error.message });
      }else{
        
        res.json({ message: 'unexpected error' });
      }
    }
  };
  editPlan = async (req: Request, res: Response) => {
    try {
      const response = await this.planService.editPlan(req.body);
      res.json({ response });
    } catch (error: unknown) {
       if(error instanceof Error){
        res.json({ message: error.message });
      }else{
        
        res.json({ message: 'unexpected error' });
      }
     
    }
  };
  softDlt = async (req: Request, res: Response) => {
    try {
      if (req.body.id) {
        const response = await this.planService.softDelete(req.body.id);
        res.json({ response: response });
      } else {
        throw new Error("id not found");
      }
    } catch (error: unknown) {
    
       if(error instanceof Error){
        res.json({ message: error.message });
      }else{
        
        res.json({ message: ResponseMessage.SERVER_ERROR });
      }
    }
  };
  fetchFeature = async (req: Request, res: Response) => {
    try {
      const response = await this.interestAndFeaturesService.fetchFeature();

      if (response) {
        res.json({ features: response.features });
      } else {
        throw new Error("feature not found");
      }
    } catch (error: unknown) {
      
       if(error instanceof Error){
        res.json({ message: error.message });
      }else{
        
        res.json({ message: 'unexpected error' });
      }
    }
  };
  fetchDashData = async (req: Request, res: Response) => {
    try {
      if (req.query.from === "dashCount") {
        const getDashBoardDatas = await this.dashService.dashCount();
        res.json(getDashBoardDatas);
      } else if (req.query.from === "SubscriberCount") {
        const getDashBoardDatas = await this.dashService.SubscriberCount();
        res.json(getDashBoardDatas);
      } else if (req.query.from === "Revenue") {
        const getDashBoardDatas = await this.dashService.revenueForGraph();
        res.json(getDashBoardDatas);
      }
    } catch (error: unknown) {
     
      
      if(error instanceof Error){
        res.status(500).json({ message: error.message });
      }else{
        
        res.json({ message: 'unexpected error' });
      }
    }
  };
  sendWarningMails = async (req: Request, res: Response) => {
    try {
      const sendWarningMale = await this.resportAbuserService.sendWarningMail(
        req.body.reporter,
        req.body.reported,
        req.body.docId
      );
      res.json({ data: sendWarningMale });
    } catch (error: unknown) {
    
       if(error instanceof Error){
        res.json({ message: error.message });
      }else{
        
        res.json({ message: 'unexpected error' });
      }
    }
  };
  getReports = async (req: Request, res: Response) => {
    try {
      const fetchReport = await this.resportAbuserService.getAllMessages();
      res.json({ data: fetchReport });
    } catch (error: unknown) {
        if(error instanceof Error){
        res.json({ message: error.message });
      }else{
        
        res.json({ message: 'unexpected error' });
      }
    }
  };
  blockAbuser = async (req: Request, res: Response) => {
    try {
      const fetchReport = await this.resportAbuserService.blockReportedUser(
        req.body.reporter,
        req.body.reported,
        req.body.docId
      );
      res.json({ data: fetchReport });
    } catch (error: unknown) {
       if(error instanceof Error){
        res.json({ message: error.message });
      }else{
        
        res.json({ message: 'unexpected error' });
      }
    }
  };
  rejecReport = async (req: Request, res: Response) => {
    try {
      const fetchReport = await this.resportAbuserService.rejectReport(
        req.body.reporter,
        req.body.reported,
        req.body.docId
      );
      res.json({ data: fetchReport });
    } catch (error: unknown) {
      if(error instanceof Error){
        res.json({ message: error.message });
      }else{
        
        res.json({ message: 'unexpected error' });
      }
    }
  };
  reportToggle = async (req: Request, res: Response) => {
    try {
      const fetchReport = await this.resportAbuserService.toggleReportRead(
        req.body.id,
        req.body.status
      );
      res.json({ data: fetchReport });
    } catch (error: unknown) {
      if(error instanceof Error){
        res.json({ message: error.message });
      }else{
        
        res.json({ message: 'unexpected error' });
      }
    }
  };
  deleteMsg = async (req: Request, res: Response) => {
    try {
      const response = await this.resportAbuserService.deleteMessage(
        req.body.id
      );
      res.json({ data: response });
    } catch (error: unknown) {
      if(error instanceof Error){
        res.json({ message: error.message });
      }else{
        
        res.json({ message: 'unexpected error' });
      }

    }
  };
}
