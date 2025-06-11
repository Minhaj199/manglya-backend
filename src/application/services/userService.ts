import { UserRepository } from "../../domain/interface/userRepository.ts";
import { PlanRepository } from "../../infrastructure/repositories/planRepositories.ts";
import { getAge } from "../../interface/utility/ageCalculator.ts";
import { Cloudinary } from "../../interface/utility/cloudinary.ts";
import { UserProfileSeriviceInterface } from "../../types/serviceLayerInterfaces.ts";
import { adminPlanType, updateData, userProfileReturnType, UserWithID } from "../../types/TypesAndInterfaces.ts";
import { AuthService } from "./authService.ts";


export class UserProfileService implements UserProfileSeriviceInterface {
    private imageSevice:Cloudinary
    private userRepository:UserRepository
    private authService:AuthService
    private planRepo:PlanRepository
    constructor(planRepo:PlanRepository,imageService:Cloudinary,userRepository:UserRepository,authService:AuthService){
        this.imageSevice=imageService
        this.userRepository=userRepository
        this.authService=authService
        this.planRepo=planRepo
    }
    async uploadPhoto(path:string,email:string){
        try {
            const url=await this.imageSevice.upload(path)
            if(url&&typeof url==='string'){
                
                const urlInserted=await this.userRepository.addPhoto(url,email)
                if(urlInserted){
    
                    return url
                }else{
                    return false
                }
            }else{
             
                throw new Error('error on image url getting')
            }
            
        } catch (error:any) {
            console.log(error)
            throw new Error(error.message)
        }
    }
    async uploadInterest(intersts:string[],email:string){
        try {
          return  this.userRepository.addInterest(intersts,email)
        } catch (error:any) {
            throw new Error(error.message||'internal server error')            
        }
    }
    async fetchUserProfile(id:unknown){
        
        try {
            if(typeof id==='string'){
                
                
                   const data:UserWithID=await this.userRepository.getUserProfile(id)
                    const useFullData={
                    PersonalInfo:{...data.PersonalInfo,age:getAge(data.PersonalInfo.dateOfBirth)},
                    PartnerData:data.partnerData,
                    Email:data.email,
                    subscriptionStatus:data.subscriber,
                    currentPlan:data.CurrentPlan
    
               }
               
               return useFullData
            }else{
                throw new Error('id not found-61')
            }    
        } catch (error:any) {
          
            throw new Error(error.message||'id not fount')
        }
    }
    async updateEditedData(data: updateData, id: unknown): Promise<{ data: userProfileReturnType; token: string | boolean }> {
        if (typeof id !== 'string') {
            throw new Error('id not found');
        }
    
        const updateData: { [key: string]: any } = {};
        
        if (data.PersonalInfo.firstName !== '') updateData['PersonalInfo.firstName'] = data.PersonalInfo.firstName;
        if (data.PersonalInfo.secondName !== '') updateData['PersonalInfo.secondName'] = data.PersonalInfo.secondName;
        if (data.PersonalInfo.state !== '') updateData['PersonalInfo.state'] = data.PersonalInfo.state;
        if (data.PersonalInfo.gender !== '') updateData['PersonalInfo.gender'] = data.PersonalInfo.gender;
        if (data.PersonalInfo.dateOfBirth !== '') updateData['PersonalInfo.dateOfBirth'] = new Date(data.PersonalInfo.dateOfBirth);
        if (data.PersonalInfo.interest !== null) updateData['PersonalInfo.interest'] = data.PersonalInfo.interest;
        if (data.partnerData.gender !== '') updateData['partnerData.gender'] = data.partnerData.gender;
        if (data.email !== '') updateData['email'] = data.email;
    
        try {
            if (Object.keys(updateData).length) {
                const data: UserWithID = await this.userRepository.update(updateData as updateData , id);
                
                const token: string = this.authService.regenerateToken(
                    JSON.stringify(data._id),
                    'user',
                    data.partnerData?.gender,
                    data.PersonalInfo?.gender
                );
    
                if (data._id) {
                    const useFullData: userProfileReturnType = {
                        PersonalInfo: { ...data.PersonalInfo, age: getAge(data.PersonalInfo.dateOfBirth) },
                        PartnerData: data.partnerData,
                        Email: data.email,
                        subscriptionStatus: data.subscriber,
                        currentPlan: data.CurrentPlan
                    };
                    return { data: useFullData, token };
                }
    
                const profile = await this.fetchUserProfile(id);
                return { data: profile, token };
            } else {
                const response = await this.fetchUserProfile(id);
                return { data: response, token: false };
            }
        } catch (error: any) {
            console.error(error);
            throw new Error(error.message);
        }
    }
    async fetchUserByID(id:unknown){
        try {
            if(typeof id ==='string'){
                const email=await this.userRepository.findEmailByID(id)
                if(email.email){
                    return email.email
                }else{
                    throw new Error('Internal server error,email not found') 
                }
            }else{
                throw new Error('Internal server error')
            }
        } catch (error:any) {
            throw new Error(error.message||'Internal server error')
        }
        
    }
    async fetchName(id:string){
        try {
            if(!id){
               throw new Error('id not found') 
            }
            return this.userRepository.fetchName(id)
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    async fetchUserDatasForAdmin(){
        try {
            
            const data =await this.userRepository.fetchUserDataForAdmin()
               if(data.length){
    
                   const processedData=data.map((el,index)=>({
                       ...el,
                       expiry:el?.CreatedAt?el.CreatedAt.toDateString():el?.CreatedAt,
                       
                       no:index+1
                   }))
                   return processedData
               }else{
                return []
               }
              
        } catch (error:any) {
          throw new Error(error.message)  
        }
    }
    async fetchSubscriberDetailforAdmin(){
        try {
            const planDataDraft =await  this.planRepo.fetchPlanAdmin()
            const planData:{name:string}[]=planDataDraft?.map(el=>{
              return  {name:el.name}
            })
                    const userDataDraft:adminPlanType[]|[]=await this.userRepository.fetchSubscriber()
                    if(userDataDraft.length>0){
                        let userData:adminPlanType[]=userDataDraft.map((el,index)=>{
                               return {no:index+1,username:el.username,MatchCountRemaining:el.MatchCountRemaining,expiry:new Date(el.expiry).toDateString(),planAmount:el.planAmount,planName:el.planName}
                            })
                       
                            
                            
                            return {userData,planData}
                        }else{
                            return {userData:[],planData:planData}
                        }
        } catch (error:any) {
            throw new Error(error.message)  
          }
    }
    async blockAndBlock(userId:string,action:boolean):Promise<boolean>{
        try {
            return this.userRepository.blockAndUnblockUser(userId,action)
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    async findCurrentPlanAndRequests(userId:string){
        try {
            return await this.userRepository.findCurrentPlanAndRequests(userId)
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    
}


