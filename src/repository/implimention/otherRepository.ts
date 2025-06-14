



import BaseRepository from "./baseRepository.ts";

import { Types } from "mongoose";
import { IFeaturesRepository, IOtherRepositories, IRefreshToken } from "../interface/IOtherRepositories.ts";
import { featureModel } from "../../models/featureModel.ts";
import { InterestModel } from "../../models/signupInterestModel.ts";
import { refeshTokenModel } from "../../models/refreshTokenModel.ts";
import { ResponseMessage } from "../../contrain/ResponseMessageContrain.ts";
import { IFeatures, IInterestInterface, IRefeshToken, IRefreshWithPopulatedData } from "../../types/TypesAndInterfaces.ts";

export class InterestRepo extends BaseRepository<IInterestInterface> implements IOtherRepositories{
  constructor(){
    super(InterestModel)
  }
  async getInterest(){
    try {
      const response:string[]= await this.model.aggregate([
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
    return response
    } catch (error) {
      if(error instanceof Error){
        throw new Error(error.message)
      }else{
        throw new Error(ResponseMessage.SERVER_ERROR)
      }
    }
    
   
  }
  async getInterestAsCategory(){
    try {
      return await this.model.findOne({},{_id:0,sports:1,music:1,food:1})
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async isExist(){
    try {
      const exitstingData:IInterestInterface|null=await InterestModel.findOne()
      if(!exitstingData){
        throw new Error(ResponseMessage.SERVER_ERROR)
      }
      return exitstingData
      
    } catch (error) {
      if(error instanceof Error){
        throw new Error(error.message)
      }else{
        throw new Error(ResponseMessage.SERVER_ERROR)
      }
    }
  }
}
export class FeaturesRepository extends BaseRepository<IFeatures> implements IFeaturesRepository{
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
        
      } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
    }
    async fetchFeature(){
      try {
      const  response:{features:IFeatures}|null=await featureModel.findOne({},{_id:0,features:1})
      return response
      }catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
    }
  }
export class TokenRepository extends BaseRepository<IRefeshToken> implements IRefreshToken{
  constructor(){
    super(refeshTokenModel)
  }
  async fetchToken(extractId:string,refreshToken:string):Promise<IRefreshWithPopulatedData|null>{
    try {
      return await this.model.findOne({token:refreshToken,userId:extractId}).populate<IRefreshWithPopulatedData>('userId')
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
  async deleteToken(id:string,token:string){
   
    try {
      await this.model.deleteOne({userId:new Types.ObjectId(id),token:token})
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(ResponseMessage.SERVER_ERROR);
      }
    }
  }
}