import { NextFunction, Request, Response } from "express";
import { ISubscriptionPlan } from "../../../types/TypesAndInterfaces.ts";
import { IAdminAuthService } from "../../../services/interfaces/IAaminAuthenticationServices.ts";
import { IUserProfileService } from "../../../services/interfaces/IUserProfileService.ts";
import { IPlanService } from "../../../services/interfaces/IPlanService.ts";
import { ResponseMessage } from "../../../constrain/ResponseMessageContrain.ts";
import { IFixedDataService } from "../../../services/interfaces/IInterstAndFeatureSerivice.ts";
import { IAdminDashService } from "../../../services/interfaces/IAdminDashboardService.ts";
import { IAdminController } from "../../interface/IAdminController.ts";
import { AppError } from "../../../types/customErrorClass.ts";

export class AdminController implements IAdminController {
  constructor(
    private adminAuth: IAdminAuthService,
    private planService: IPlanService,
    private interestAndFeaturesService: IFixedDataService,
    private userProfileService: IUserProfileService,
    private dashService: IAdminDashService
  ) {}
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { message, key, token } = this.adminAuth.login(email, password);
      if (message === "admin verified") {
        res.json({ adminVerified: true, token: token });
      } else {
        res.json({ [key as string]: message });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "user name not found") {
          res.json({ username: error.message });
        }
        if (error.message === "password not matching") {
          res.json({ password: error.message });
        }
      } else {
        res.json({ password: ResponseMessage.SERVER_ERROR });
      }
    }
  };
  fetchData = async (req: Request, res: Response, next: NextFunction) => {
    /////////////// fetching suscriber page data and user page data////////////////
    try {
      const response = await this.userProfileService.fetchDatasForAdmin(
        req.query.from
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
  userBlockAndUnblock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await this.userProfileService.blockAndBlock(
        req.params.id,
        req.body.updateStatus
      );
      if (response) {
        res.json({ message: "updated" });
      } else {
        throw new Error("error on updation");
      }
    } catch (error) {
      next(error);
    }
  };
  createPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plan: ISubscriptionPlan = {
        name: req.body.datas.name,
        features: req.body.handleFeatureState,
        amount: req.body.datas.amount,
        connect: req.body.datas.connect,
        duration: parseInt(req.body.datas.duration),
      };
      const response = await this.planService.createPlan(plan);
      res.json({ result: response });
    } catch (error: unknown) {
      next(error);
    }
  };

  fetchPlanData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plans } = await this.planService.fetchAll();
      res.json({ plans });
    } catch (error: unknown) {
      next(error);
    }
  };
  editPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params || !req.params.id) {
        throw new AppError(ResponseMessage.ID_NOT_FOUND);
      }
      const response = await this.planService.editPlan({
        ...req.body,
        _id: req.params.id,
      });
      res.json({ response });
    } catch (error: unknown) {
      next(error);
    }
  };
  softDlt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.params.id) {
        const response = await this.planService.softDelete(req.params.id);
        res.json({ response: response });
      } else {
        throw new AppError(ResponseMessage.ID_NOT_FOUND);
      }
    } catch (error: unknown) {
      next(error);
    }
  };
  fetchFeature = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.interestAndFeaturesService.fetchFeature();
      if (response) {
        res.json({ features: response.features });
      } else {
        throw new Error("feature not found");
      }
    } catch (error: unknown) {
      next(error);
    }
  };
  fetchDashData = async (req: Request, res: Response, next: NextFunction) => {
    ////////////////// fech data for dash board///////////
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
      next(error);
    }
  };
}
