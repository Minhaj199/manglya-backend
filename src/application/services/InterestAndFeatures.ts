import { InterestRepo } from "../../Infrastructure/repositories/otherRepo.js"; 
import { FeaturesRepository } from "../../Infrastructure/repositories/otherRepo.js";
import { FixedDataServiceInterface } from "../../types/serviceLayerInterfaces.js";

export class FixedDataService implements FixedDataServiceInterface{
    private interestRepo:InterestRepo
    private featureRepo:FeaturesRepository

    constructor(interestRepo:InterestRepo,featureRepo:FeaturesRepository){
        this.interestRepo=interestRepo
        this.featureRepo=featureRepo
    }

    async creatInterest(){
        const interestData={
            sports:['Football','Cricket','Hockey'],
            music:['Hollywood','Bollywood','Molywood'],
            food:['Biryani', 'Sadya']
        }
        try {
            const isExist=await this.interestRepo.isExist()
             if(!isExist){
                await this.interestRepo.create(interestData)
                     
            }
        } catch (error) {
            
        }
    }
    async createFeatures(){
        const features=['Unlimited message','Suggestion','Priority']
        try {

            const isExist=await this.featureRepo.isExits()
        if(!isExist){
         await this.featureRepo.create({features})
         console.log('features added')
         }
        } catch (error:any) {
            throw new Error(error.message)  
        }
    }
    async fetchFeature(){
        try {
            const result=await this.featureRepo.fetchFeature()
            return result
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    async fetchInterestAsCategory(){
        try {
            const data= await this.interestRepo.getInterestAsCategory( )
            if(data){
                return data   
    
            }  else{
                throw new Error('interest not found')
            }
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
}