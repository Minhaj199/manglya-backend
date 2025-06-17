import { NextFunction, Request, Response } from "express";

export interface IAdminController{
    login (req: Request, res: Response,next:NextFunction):Promise<void> ,
      fetchData (req: Request, res: Response,next:NextFunction):Promise<void>, 
      userBlockAndUnblock (req: Request, res: Response,next:NextFunction):Promise<void>,
      addPlan (req: Request, res: Response,next:NextFunction):Promise<void>,
      fetchPlanData (req: Request, res: Response,next:NextFunction):Promise<void>,
      editPlan (req: Request, res: Response,next:NextFunction):Promise<void>,
      softDlt (req: Request, res: Response,next:NextFunction):Promise<void>,
      fetchFeature (req: Request, res: Response,next:NextFunction):Promise<void>,
      fetchDashData (req: Request, res: Response,next:NextFunction):Promise<void>,
      
}
export interface IReportAbuseController{
  sendWarningMails (req: Request, res: Response,next:NextFunction):Promise<void>,
      getReports (req: Request, res: Response,next:NextFunction):Promise<void>,
      blockAbuser (req: Request, res: Response,next:NextFunction):Promise<void>,
      rejecReport (req: Request, res: Response,next:NextFunction):Promise<void>,
      reportToggle (req: Request, res: Response,next:NextFunction):Promise<void>,
      deleteMsg (req: Request, res: Response,next:NextFunction):Promise<void>,
}