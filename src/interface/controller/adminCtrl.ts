import {  Request,Response } from "express";
import { AdminAuth } from "../../application/services/adminAuthService.ts";
import { PlanRepository } from "../../infrastructure/repositories/planRepositories.ts"; 
import { SubscriptionPlan } from "../../domain/entity/PlanEntity.ts";

import { UserProfileService } from "../../application/services/userService.ts";
import { PlanService } from "../../application/services/planService.ts";
import { FixedDataService } from "../../application/services/InterestAndFeatures.ts";
import { DashService } from "../../application/services/adminDashService.ts";
import { ReportAbuseService } from "../../application/services/reportAbuseService.ts";

import { resportAbuserService } from "../routes/userRoutes.ts";
const planRepo=new PlanRepository()

export const login=(req:Request,res:Response,adminAuth:AdminAuth)=>{

    try {
        const {email,password}=req.body
        const isValid=adminAuth.login(email,password)
      
        if(isValid?.message==='admin verified'){          
            res.json({adminVerified:true,token:isValid.token})
        }else if(isValid?.message==='password not matching'){
            res.json({password:isValid.message})
        }else if(isValid?.message==='user name not found'){
            res.json({username:'user name not found'})    
            }
    } catch (error:any) {
      
       if(error.message==='user name not found'){
           res.json({username:error.message})
       }
    if(error.message==="password not matching"){
            res.json({password:error.message})
        }
    }
}
export const fetechData=async(req:Request,res:Response,userService:UserProfileService)=>{
    try {
       if(req.query.from&&req.query.from==='subscriber'){
        const getSubscriberData=await  userService.fetchSubscriberDetailforAdmin()
        
        
        res.json(getSubscriberData)
       }
       else if(req.query.from&&req.query.from==='user'){
            const processedData=await userService.fetchUserDatasForAdmin()       
           res.json(processedData)
       }
    } catch (error) {
        console.log(error)
    }
}

export const userBlockAndUnblock=async(req:Request,res:Response,userService:UserProfileService)=>{
    try {
      
       const response= await userService.blockAndBlock(req.body.id,req.body.updateStatus)
     
       if(response){
            res.json({message:'updated'})
        }else{
            throw new Error('error on updation')
        }
    } catch (error) {
        console.log(error)
    }
}
export const addPlan=async(req:Request,res:Response,planService:PlanService)=>{

    try {
      
        const plan:SubscriptionPlan={name:req.body.datas.name,features:req.body.handleFeatureState,
            amount:req.body.datas.amount,connect:req.body.datas.connect,duration:parseInt(req.body.datas.duration)}
          const response=await planService.createPlan(plan)
          res.json({status:response})
    } catch (error:any) {
        
        res.json({message:error.message})
    }
}
export const fetechPlanData=async (req:Request,res:Response,planService:PlanService)=>{
    try {
        
        const plans=await planService.fetchAll()
        
        res.json({plans}) 
    } catch (error:any) {
        res.json(error.message)
        
    }
}
export const editPlan=async(req:Request,res:Response,planService:PlanService)=>{
    try {
        
        const response=await planService.editPlan(req.body)
        res.json({response})
    } catch (error:any) {
        console.log(error)
        res.json({message:error.message})
    }

}
export const softDlt=async(req:Request,res:Response,planService:PlanService)=>{
 
    try {
        if(req.body.id){
            const response=await planService.softDelete(req.body.id)
            res.json({response:response})
        }else{
            throw new Error('id not found')
        }
    } catch (error:any) {
        res.json({message:error.message})
    }
}
export const fetchFeature=async(req:Request,res:Response,interestService:FixedDataService)=>{
    try {
            const response=await interestService.fetchFeature()
        
        if(response){
           
            res.json({features:response.features})
        }else{
            throw new Error("feature not found");
        }
    } catch (error:any) {
        res.json({message:error.message})
    }
}
export const fetchDashData=async(req:Request,res:Response,dashService:DashService)=>{
    try {      
        
        if(req.query.from==='dashCount'){
           const getDashBoardDatas=await dashService.dashCount()
            res.json(getDashBoardDatas)   
        }
        else if(req.query.from==='SubscriberCount'){
            const getDashBoardDatas=await dashService.SubscriberCount()
            res.json(getDashBoardDatas)
        }else if(req.query.from==='Revenue'){
            const getDashBoardDatas=await dashService.revenueForGraph()
            res.json(getDashBoardDatas)
        }
    } catch (error:any) {
        console.log(error)
        res.status(500).json({message:error.message})
    }

}
export const sendWarningMails=async(req:Request,res:Response,reportAbuseService:ReportAbuseService)=>{
    try {
      
       const sendWarningMale=await reportAbuseService.sendWarningMail(req.body.reporter,req.body.reported,req.body.docId)
       res.json({data:sendWarningMale})
    } catch (error:any) {
        res.json({message:error.message})
    }
  
}
export const getReports=async(req:Request,res:Response,reportAbuseService:ReportAbuseService)=>{
    try {
       const fetchReport=await reportAbuseService.getAllMessages()
       res.json({data:fetchReport})
    } catch (error:any) {
        res.json({message:error.message})
    }
  
}
export const blockAbuser=async(req:Request,res:Response,reportAbuseService:ReportAbuseService)=>{
    try {
        const fetchReport=await reportAbuseService.blockReportedUser(req.body.reporter,req.body.reported,req.body.docId)
        res.json({data:fetchReport})
    } catch (error:any) {
        res.json({message:error.message})
    }
   

}
export const rejecReport=async(req:Request,res:Response,reportAbuseService:ReportAbuseService)=>{
    try {
        const fetchReport=await resportAbuserService.rejectReport(req.body.reporter,req.body.reported,req.body.docId)
        res.json({data:fetchReport})
    } catch (error:any) {
        res.json({message:error.message})
    }
   

}
export const reportToggle=async(req:Request,res:Response,reportAbuseService:ReportAbuseService)=>{
    try {
        const fetchReport=await reportAbuseService.toggleReportRead(req.body.id,req.body.status)
        res.json({data:fetchReport})
    } catch (error:any) {
        res.json({message:error.message})
    }
   

}
export const deleteMsg=async(req:Request,res:Response,reportAbuseService:ReportAbuseService)=>{
    try {
        const response=await reportAbuseService.deleteMessage(req.body.id)
        res.json({data:response})
    } catch (error:any) {
        res.json({message:error.message})
    }
   

}




