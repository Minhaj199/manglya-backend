import { Response,Request} from "express";
import { AuthService } from "../../application/services/authService.js"; 
import { PartnerProfileService } from "../../application/services/partnersProfileService.js";
import { UserProfileService } from "../../application/services/userService.js";
import { PaymentSerivice } from "../../application/services/paymentService.js";
import { PlanService } from "../../application/services/planService.js";
import { ReportAbuseService } from "../../application/services/reportAbuseService.js";
import { ChatService } from "../../application/services/chatService.js";;
import { MessageService } from "../../application/services/messageServie.js";
import { OtpService } from "../../application/services/OtpService.js";
import { FixedDataService } from "../../application/services/InterestAndFeatures.js";
import { UserRepsitories } from "../../Infrastructure/repositories/userRepository.js";



export const signup=async (req:Request,res:Response,authService:AuthService)=>{
    try {
        const user=await authService.signupFirstBatch(req.body)
        res.setHeader('authorizationforuser', user?.refreshToken)
        res.status(201).json({message:'sign up completed',token:user?.token}) 
    } catch (error:any) {
        
        if(error){
         if(error.code===11000){
            res.json({message:'Email already exist',status:false})
        }else{
            
        res.json({message:error.message||'error on signup please try again'})
     }
 }
    }
}
export const otpCreation=async(req:Request,res:Response,authService:AuthService,otpService:OtpService)=>{
    const {email,from}=req.body
    
   if(from==='forgot'){
    try {
        const response=await otpService.otpVerificationForForgot(email,from)
        if(response){
            if(response){
                res.status(200).json({message:'Email send successfull'})
             } 
        }
    } catch (error:any) {
        res.status(500).json(error.message)
    }
   }else{

       try {
           
           const response=await otpService.otpVerification(email,req.body.from)
           if(response){
               res.status(200).json({message:'Email send successfull'})
            }
        } catch (error:any) {
            res.status(500).json(error.message)
        }
    }
    
}
export const login=async(req:Request,res:Response,authService:AuthService)=>{

    const {email,password}=req.body
  
    try {
        const response=await authService.login(email,password)

        const {token,refresh,name,photo,partner,gender,subscriptionStatus}=response
        res.setHeader('authorizationforuser', refresh)

        res.status(200).json({message:'password matched',token,refresh,name,photo,partner,gender,subscriptionStatus})
   
    } catch (error:any) {   
        res.json({message:error.message})
    }
}
export const fetechProfileData=async(req:Request,res:Response,partnersProfileService:PartnerProfileService)=>{
    
   
   
    try {
        
        if(req.userID ){

         const response= await partnersProfileService.fetchProfileData(req.userID,req.gender,req.preferedGender)            
           
         res.json(response)
        }else{
            throw new Error('id not found')
        }
            
       
        
    } catch (error:any) {
        res.json({message:error.message})
       
    }
}
export const forgotCheckValidate=async(req:Request,res:Response,otpService:OtpService):Promise<void>=>{
 
    try {
        if(typeof req.query.email==='string'){

            let decoded = decodeURI(req.query.email);
            
            const email=decoded
           
            const isValid=await otpService.ForgetValidateEmail(email)
                      
            if(isValid){
                
           const response=await otpService.otpVerificationForForgot(email,'forgot')
           if(response){

               res.json ({email:isValid.email})
           }
            }else{
                 res.json(false)
            }
        }
    } catch (error) {
        res.json(error) 
    }
}
export const forgotCheckValidateSigunp=async(req:Request,res:Response,otpService:OtpService):Promise<void>=>{
  
    try {
 
            const {email}=req.body
           
            const isValid=await otpService.ForgetValidateEmail(email)
                      
            if(isValid){
                res.json ({email:isValid.email})
            }else{
                 res.json(false)
            }
        
    } catch (error) {
        res.json(error) 
    }
}
export const otpValidation=async(req:Request,res:Response,otpService:OtpService):Promise<void>=>{
    try {
        const {email,otp,from}=req.body
       
        const isValid=await otpService.otpValidation(email,otp,from)
      
        if(isValid){
            res.json({message:'OTP valid'})
        }else{
            res.json({message:'OTP not valid'})
        }
    } catch (error) {
        res.json(error)
    }
}
export const changePassword=async(req:Request,res:Response,authService:AuthService):Promise<void>=>{
    try {
        const {password,email}=req.body

        const isValid=await authService.passwordChange(email,password)
        
        if(isValid){
            res.json({message:'password changed'})
        }else{
            res.json({message:'error on password'})
        }
    } catch (error) {
        res.json(error)
    }
}
 export const secondBatch=async(req:Request,res:Response,userProfileService:UserProfileService):Promise<void>=>{
    const obj:{url:string|boolean,responseFromAddinInterest:string|boolean}={responseFromAddinInterest:false,url:false}
     try {
        if(req.file&&req.file.path){
            
            const image=req.file?.path||''
            
           const response=await userProfileService.uploadPhoto(image,req.body.email)||''
    
         obj.url=response
        }
        const interest:string[]=JSON.parse(req.body.interest)
        if(interest.length>0){
             const responseFromAddinInterest=await userProfileService.uploadInterest(interest,req.body.email)
              obj.responseFromAddinInterest=responseFromAddinInterest
          }
          
    res.json(obj)
    } catch (error:any) {
         res.json( error)
    }
     

}
export const addMatch=async(req:Request,res:Response,patnerServiece:PartnerProfileService):Promise<void>=>{
   
    try {
        
        const response=await patnerServiece.addMatch(req.userID,req.body.matchId)
         
        res.json(response) 
    } catch (error) {
        res.json(error)
    }
}
export const  manageReqRes=async(req:Request,res:Response,partnersProfileService:PartnerProfileService):Promise<void>=>{
   
    try {
        const response=await partnersProfileService.manageReqRes(req.body.id,req.userID,req.body.action)
        if(response){

            res.json({message:'changed'})
        }else{
            throw new Error('error on request management')
        }
    } catch (error:any) {
        res.json(error.message)
    }
    
}
export const fetchPlanData=async (req:Request,res:Response,planService:PlanService):Promise<void>=>{
    try {
        const data=await planService.fetchAll()
        res.json(data)
    } catch (error:any) {
        res.json({message:error.message})
    }

}
export const purchasePlan=async (req:Request,res:Response,paymentSerivice:PaymentSerivice):Promise<void>=>{
    try {
       if( !req.userID){
          throw new Error('user id not found')

       }
       if(req.body.planData&&req.body.token&&req.body.token.email){

           const response=await paymentSerivice.purchase(req.body.planData,req.body.token,req.body.token.email,req.userID)
            res.json({status:response})
        }else{
        res.json({message:'client side error'})
        
       }
       
        
    } catch (error:any) {
        console.log(error)
        res.json({message:error.message})
    }
}
export const fetchDataForProfile=async (req:Request,res:Response,partnerServiece:PartnerProfileService):Promise<void>=>{
    try {
        const response=await partnerServiece.fetchUserForLandingShow()
        if(response){
            res.json(response)
        }else{
            throw new Error('Error on new user data collection')
        }
    } catch (error:any) {
        res.json({error:error.message})
    }
}
export const fetchInterest=async (req:Request,res:Response,interestService:FixedDataService):Promise<void>=>{
    try {
       const response=await interestService.fetchInterestAsCategory()

       if(response){
        res.json({Data:response})
       }else{
        throw new Error("Error on interst getting")
       } 
    } catch (error:any) {
        res.json({message:error.message||'Error on message interest getting'})
    }
}
export const getUserProfile=async(req:Request,res:Response,userProfileService:UserProfileService)=>{
   
    try {
        const user=await userProfileService.fetchUserProfile(req.userID)
        res.json({user})
    } catch (error:any) {
        res.json({message:error.message})
    }
}
export const otpForResetPassword=async(req:Request,res:Response,otpService:OtpService)=>{
    try {
        const sentOtp= await otpService.otpDispatchingForEditProfile(req.userID)
        res.json(sentOtp)
        
    } catch (error:any) {
        res.json(error.message||'internal server error')
    }
}
export const otpForUserResetPassword=async(req:Request,res:Response,otpService:OtpService)=>{
    try {
        
        const validate=await otpService.validateOtpForEditProfiel(req.userID,JSON.stringify(req.body.OTP),req.body.from)
        res.json({status:validate})
    } catch (error:any) {
        console.log(error)
        res.json({message:error.message})
    }
    
}
export const resetPassword=async(req:Request,res:Response,authService:AuthService)=>{
    try {
        const { password ,confirmPassword }=req.body
        if(password===confirmPassword){
            const response=await authService.changePasswordEditProfile(password,req.userID)
           
            res.json({status:response})
        }else{
            throw new Error('Password not match')
        }
        
    } catch (error:any) {
        res.status(500).json({message:error.message})
    }
}
export const editProfile=async(req:Request,res:Response,userProfileService:UserProfileService)=>{
   
  
    try {
        if(req.file){ 
  
            const email=await userProfileService.fetchUserByID(req.userID)
            await userProfileService.uploadPhoto(req.file.path,email)
            const updateDetail=await userProfileService.updateEditedData(JSON.parse (req.body.data),req.userID)
                res.json({status:true, newData:updateDetail})
        }else{
            const updateDetail=await userProfileService.updateEditedData(JSON.parse (req.body.data),req.userID)
            if(typeof updateDetail==='string'){
                res.json({newData:updateDetail})
            }else{
                res.json({newData:updateDetail})
            }
        }
    } catch (error:any) {
        
        console.log(error)
        res.json({message:error.messaeg||'error on update'})
    }
}
export const matchedUser=async(req:Request,res:Response,partnerServiece:PartnerProfileService)=>{

    try {
        
        const fetchMatchedUsers=await partnerServiece.matchedProfiles(req.userID)
      
        if(fetchMatchedUsers){  
            res.json({fetchMatchedUsers})
        }else{
            res.json(false)
        }
    } catch (error) {
        res.status(500).json({message:error})
    }
}
export const deleteMatched=async(req:Request,res:Response,partnerServiece:PartnerProfileService)=>{
    try {
        const {id}=req.body
       
        const response=await partnerServiece.deleteMatchedUser(req.userID,id)
        res.json({status:response})
    } catch (error:any) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}
export const reportAbuse=async(req:Request,res:Response,reportAbuse:ReportAbuseService)=>{
    try {   
        
    
        if(!req.body.reason||!req.body.moreInfo||!req.body.profileId){
            throw new Error('In suficient data error')
        }      
        const response=await reportAbuse.createReport(req.userID,req.body.profileId,req.body.reason,req.body.moreInfo)
        
        if(typeof response==='boolean'){  
            res.json({data:response})
        }else{
            res.json({data:false})

        }
    } catch (error:any) {
        res.json({message:error.message})
    }
  
}
export const fetchSuggestion=async(req:Request,res:Response,partnerServiece:PartnerProfileService)=>{
    try {
        const result=await partnerServiece.fetchSuggestions(req.userID,req.preferedGender,req.gender) 
        res.json(result)
    } catch (error:any) {
        res.json({message:error.messaeg||'error on suggestion fetching'})
    }
}
export const getChats=async(req:Request,res:Response,chatService:ChatService)=>{
    try {
        const response=await chatService.fetchChats(req.body.id,req.userID)
        
        res.json(response)
    } catch (error:any) {
        res.json({message:error.messaeg||'error on chat fetching'})
    }
}
export const createTexts=async(req:Request,res:Response,chatService:ChatService)=>{
   
    try { 
         if(req.body.chatId===''){
            throw new Error('chat id not found')
         }
        
        const response=await chatService.createMessage(req.body.chatId,req.body.senderIdString,req.body.receiverId,req.body.text,req.body.image)
        res.json({newMessage:response})
    } catch (error:any) {
        console.log(error)
        res.json({message:error.messaeg||'error chat'})
    }
}
export const getMessages=async(req:Request,res:Response,messageService:MessageService)=>{
    try {
        const response=await messageService.findAllMessage(req.params.id)
        res.json(response)
    } catch (error:any) {
        res.json({message:error.messaeg||'error on chat fetching'})
    }
}
export const getuserForChat=async(req:Request,res:Response,chatRoomService:ChatService)=>{
    try {
        const response=await chatRoomService.fetchUserForChat(req.params.id)
        res.json(response)
    } catch (error:any) {
        res.json({message:error.messaeg||'error on chat fetching'})
    }
}
export const MsgCount=async(req:Request,res:Response,messageService:MessageService)=>{
    try { 
       
        const newMessagesForNav=await messageService.fetchMessageCount(req.query?.from,req.userID)
        const newMessagesNotifiation=await messageService.findNewMessages(req.userID)
    
        res.json({newMessagesForNav,newMessagesNotifiation}) 
    } catch (error) {
        res.json({count:0})
    }
}
export const MessageViewed=async(req:Request,res:Response,messageRepo:MessageService)=>{
    try { 
        const response=await messageRepo.makeAllUsersMessageReaded(req.body.from,req.body.ids)
        res.json({status:response}) 
    } catch (error) {
        res.json({status:false})
    }
}
export const saveImage=async(req:Request,res:Response,messageService:MessageService)=>{
    try { 
      if(req.file&&typeof req.file.path==='string'){

          const getImgUrl=await messageService.createImageUrl(req.file.path)
          res.json({image:getImgUrl}) 
      }else{
        throw new Error('internal server error on photo send')
      }
    } catch (error) {
        res.json({status:false})
    }
}

export const getNewToken=async (req:Request,res:Response,authService:AuthService)=>{
   
    try {
        const response=await authService.getNewToken(req.body.refresh)
        if(response){
            res.json({token:response})
        }else{
            throw new Error('refresh token not found')
        }
    } catch (error) {
        res.json('error on validating token please login again')
    }

}
export const planHistoryAndRequest=async (req:Request,res:Response,userProfile:UserProfileService,planService:PlanService)=>{
   
    const id=req.userID
   
    try {
        if(typeof id!=='string'){
            throw new Error('id not found')
        }
        const response=await userProfile.findCurrentPlanAndRequests(id)
        const history= await planService.fetchHistory(id)
        
        res.json({...response,history})
       
    } catch (error) {
        res.json('error on validating token please login again')
    }

}



