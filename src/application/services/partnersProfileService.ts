
import { UserRepository } from "../../domain/interface/userRepositoryInterface.js";
import { IUserModel } from "../../Infrastructure/db/userModel.js";
import { InterestRepo } from "../../Infrastructure/repositories/otherRepo.js";
import { getAge } from "../../interface/utility/ageCalculator.js";
import { socketIdMap } from "../../server.js";
import { ParnterServiceInterface } from "../../types/serviceLayerInterfaces.js";
import { ExtentedMatchProfile, LandingShowUesrsInterface, MatchedProfile,  profileTypeFetch, suggestionType, UserWithID } from "../../types/TypesAndInterfaces.js";




export class PartnerProfileService implements ParnterServiceInterface{
   private userRepository:UserRepository
   private interestRepo:InterestRepo
   constructor(userRepository:UserRepository,interestRepo:InterestRepo){
    this.userRepository=userRepository

    this.interestRepo=interestRepo
   }
   
    async addMatch(userId: unknown, matchedId: string,): Promise<boolean> {
     try {
         if( typeof userId==='string'){
             const user:UserWithID|null=await this.userRepository.getUserProfile(userId)
             if(user){
                if(user.subscriber==='subscribed'){
                    if(user.CurrentPlan){
                        if (user.CurrentPlan.Expiry > new Date()){
                            return this.userRepository.addMatch(userId,matchedId,user)
                        }else{
                            throw new Error("You plan is Expired");
                        }
                    }else{
                        throw new Error("No active Plan");
                    }
                }else if (user.subscriber === "connect over") {
                    throw new Error("You connection count over!! please buy a plan");
                  } else {
                    throw new Error("You are not subscribed, please buy a plan");
        
                  }
             }else{

                 throw new Error('user not found')
             }

         }else{
             throw new Error('id not found')

         }
       
     } catch (error:any) {
        throw new Error(error.message)
     }
    }
    async manageReqRes(requesterId: string, userId: unknown,action: string){
       try {
        console.log(requesterId,userId)
           if(typeof userId==='string'){
               return this.userRepository.manageReqRes(requesterId,userId,action)
           }else{
               return false
           }
       } catch (error:any) {
        throw new Error(error.message||'internal server error on manage request')
       }
    }
    async fetchProfileData(userId:string,userGender:string,partnerGender:string){
       try {
        const datas:{profile:profileTypeFetch,request:profileTypeFetch}[]=await this.userRepository.fetchPartnerProfils(userId,userGender,partnerGender)
        const currntPlan=await this.userRepository.getCurrentPlan(userId)
        let interest:unknown[]=await this.interestRepo.getInterest()
        
         let interestArray:{allInterests:string[]}[]=[]
            if(interest?.length){
             interestArray= interest as {allInterests:string[]}[]
            }
            if(!interestArray[0].allInterests){
                throw new Error('Error on interest fetching')
            }

            
            if(datas[0].profile){

                 datas[0].profile=datas[0].profile.map((el,index)=>{
                
                    return ({
                        ...el,
                        no:index+1,
                        age:getAge(el.dateOfBirth)
                    }) 
                })
            }
            
            return {datas,currntPlan:currntPlan[0]?.CurrentPlan,interest:interestArray[0].allInterests}
       } catch (error:any) {
            throw new Error(error.message)
       }
    }
    async fetchUserForLandingShow(){
        try {
            const data:LandingShowUesrsInterface[]|[]=await this.userRepository.getUsers()
            if (data.length>0) {
                const response: { name: string; age: number; image: string }[] = [];
                data.forEach((el) => {
                  response.push({
                    name: `${el.name} ${el.secondName}`,
                    age: getAge(el.age),
                    image: el.image || "",
                  });
                });
                return response;
            }else{
                return [] 
            }
        } catch (error:any) {
            throw new Error(error.message||'error on page showing')
        }
    }
    async matchedProfiles(id:unknown){
        

try {

    if(typeof id==='string'){
        let formatedResponse:ExtentedMatchProfile[]=[]
        let Places:string[]=[]
        const response:MatchedProfile[]|[]=await this.userRepository.getMatchedRequest(id)
        if(response.length){
           let online:string[]=[]
         
           if(socketIdMap.size>=1){
            for(let value of socketIdMap.keys()){
                online.push(value)
            }
           }
            response?.forEach(element => {
                formatedResponse.push({...element,age:getAge(element.dateOfBirth)})
                if(!Places.includes(element.state))
                Places.push(element.state)
            });
            return {formatedResponse,Places,onlines:online}
        }else{
            return response 
        }
        
    }else{
        throw new Error('id not found')
    }
    
} catch (error:any) {
    throw new Error(error.message||'error on request fetching')
}

}
    async deleteMatchedUser(userId:unknown,partnerId:string){
       
        if(typeof userId!=='string'||!partnerId){
            throw new Error('error on deleting user')
        }
        try {
       
            if(typeof userId==='string'&&typeof partnerId==='string'){
                const response=await this.userRepository.deleteMatched(userId,partnerId)
                return response
            }else{
                throw new Error('error on ids')
            }
        } catch (error:any) {
            throw new Error(error.message||'error on deletion')
        }
    }  
    async fetchSuggestions(id:unknown,partnerPreference:string,gender:string){
         try {     
                    if(typeof id==='string' ){
                        let fetchedProfiles:{profile:suggestionType[],request:profileTypeFetch}[]=[];
                         let datas:{profile:suggestionType[],request:profileTypeFetch,userProfile:IUserModel[]}[]=await this.userRepository.fetchSuggetions(id,gender,partnerPreference)
                        let currntPlan=await this.userRepository.getCurrentPlan(id)
                        if(datas[0].profile){  
                             datas[0].profile=datas[0].profile?.map((el,index)=>{
                            
                                return ({
                                    ...el,
                                    no:index+1,
                                    age:getAge(el.dateOfBirth)
                                }) 
                            })
                        }
        
                        
                        if(datas[0].profile&&datas[0].userProfile){
                          
                            const main:IUserModel=datas[0].userProfile[0]
                          
                            if(!main.PersonalInfo?.interest?.length){
                                return   {datas:[{profile:[]}]}
                            }
                            let FirstCat:{subscriber:suggestionType[],
                                 connectionOver:suggestionType[],prioriy:suggestionType[]}={subscriber:[],connectionOver:[],prioriy:[]}
                            for (let user of datas[0].profile){
                                
                                if(main.PersonalInfo?.interest.every(el=>user?.interest.includes(el))){
                                
                                    if(user.subscriber==='subscribed'||user.subscriber==="connection over"){
                                       
                                        if(user?.planFeatures?.includes('Priority')){
                                            FirstCat.prioriy.push({...user,matchStatics:'hr'})   
                                        }else{
                                           
                                            FirstCat.subscriber.push({...user,matchStatics:'rc'})
                                        }
                                    }
                                    
                                }else{
                                    
                                    if(user.subscriber==='subscribed'||user.subscriber==="connection over"){
                                        
                                        
                                       
                                        if(user?.planFeatures&&user?.planFeatures?.includes('Priority')&&
                                        user.interest?.some(elem=>main.PersonalInfo.interest?.includes(elem))){
                                            FirstCat.prioriy.push({...user,matchStatics:'phr'})   
                                        }
                                        else if(user?.interest&&user?.interest.some(elem=>main.PersonalInfo?.interest?.includes(elem))){
                                            FirstCat.prioriy.push({...user,matchStatics:'np'}) 
                                        }
                                    }
                                    
                                }
                                
                            }
                            const array:suggestionType[]=[...FirstCat.prioriy,...FirstCat.subscriber,...FirstCat.connectionOver]
                                fetchedProfiles=[{profile:array,request:datas[0].request}]
                            
                        }
                        
                        return({datas:fetchedProfiles,currntPlan:currntPlan[0]?.CurrentPlan})
                    }else{
                        throw new Error('id not found')
                    }
                } catch (error:any) {
                    console.log(error)
                  throw new Error(error.message||'Error on suggstion page fetching')
                }
    }
    async createRequeset(id:string){
        if(!id){
            throw new Error('internal server error ')
        }
        try {
            return await this.userRepository.createRequest(id)
        } catch (error:any) {
            throw new Error(error.messag||'internal server error')
        }
    }
}
