import { FeaturesRepositoryInterface, OtherRepositoriesInterface, RefreshTokenInterface } from "../../domain/interface/otherRepositories.ts";
import { InterestInterface, RefeshToken, RefreshWithPopulatedData } from "../../types/TypesAndInterfaces.ts";
import { featureModel, Features } from "../db/featureModel.ts";
import { InterestModel } from "../db/signupInterest.ts";
import BaseRepository from "./baseRepository.ts";
import { refeshTokenModel } from "../db/refreshToken.ts";
import { Types } from "mongoose";

export class InterestRepo extends BaseRepository<InterestInterface> implements OtherRepositoriesInterface{
  constructor(){
    super(InterestModel)
  }
  async getInterest(){
    
   return await this.model.aggregate([
      {
          $project: {
            arrayFields: {
              $filter: {
                input: { $objectToArray: "$$ROOT" }, 
                as: "field",
                cond: { $isArray: "$$field.v" }, 
              },
            },
          },
        },
        {
          $project: {
            allInterests: {
              $reduce: {
                input: "$arrayFields",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this.v"] }, 
              },
            },
          },
        },
    ]);
  }
  async getInterestAsCategory(){
    try {
      return await this.model.findOne({},{_id:0,sports:1,music:1,food:1})
    } catch (error:any) {
      throw new Error(error.message)
    }
  }
  async isExist(){
    const exitstingData=await InterestModel.findOne()
    return exitstingData
  }
}
export class FeaturesRepository extends BaseRepository<Features> implements FeaturesRepositoryInterface{
    constructor(){
      super(featureModel)
    }
    async isExits(){
      try {
        const isExist:{features:string[]}|null=await this.model.findOne()
        if(isExist){
          return true
        }else{
          return false
        }
        
      } catch (error:any) {
        throw new Error(error.message)
      }
    }
    async fetchFeature(){
      try {
      const  response:{features:Features}|null=await featureModel.findOne({},{_id:0,features:1})
      return response
      } catch (error:any) {
        throw new Error(error.message)
      }
    }
  }
export class TokenRepository extends BaseRepository<RefeshToken> implements RefreshTokenInterface{
  constructor(){
    super(refeshTokenModel)
  }
  async fetchToken(extractId:string,refreshToken:string):Promise<RefreshWithPopulatedData|null>{
    try {
      return await this.model.findOne({token:refreshToken,userId:extractId}).populate<RefreshWithPopulatedData>('userId')
    } catch (error:any) {
      throw new Error(error.message)
    }
  }
  async deleteToken(id:string,token:string){
   
    try {
      const response=await this.model.deleteOne({userId:new Types.ObjectId(id),token:token})
      
    } catch (error:any) {
      throw new Error(error)
    }
  }
}