import jwt from 'jsonwebtoken'
import { TokenRepository } from '../repository/implimention/otherRepository.ts' 
import { Types } from 'mongoose'
import { IJwtService } from '../types/UserRelatedTypes.ts'
import { IJwtInterface } from '../types/TypesAndInterfaces.ts'



export class JWTAdapter implements IJwtService{
    private tokenRepo:TokenRepository
    constructor (tokenRepo: TokenRepository){
        this.tokenRepo=tokenRepo
    }
    createAccessToken(information:{id:string,role:string,preferedGender?:string,gender?:string},key:string,option:{expiresIn:string}){
        try {
            
            const {id,role,preferedGender='no parnter',gender='not available'} =information
           const token= jwt.sign({id,role,preferedGender,gender},key,option)
            return  token
        }catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
    }
   async createRefreshToken(information:{id:string,role:string},key:string,option:{expiresIn:string}){
        try {
            
            const {id,role} =information
           const token= jwt.sign({id,role},key,option)
            await this.tokenRepo.create({userId:new Types.ObjectId(id.slice(1,25)),token:token})
            return  token
        } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
    }
    verifyAccessToken(token:string,from:string){
        try {
            if(from==='admin'){ 
                const decode=jwt.verify(token,process.env.JWT_ACCESS_SECRET_ADMIN||'123')
                return decode
            }else if(from==='user'){
                const decode=jwt.verify(token,process.env.JWT__ACCESS_SECRET_USER||'123')
                return decode
            }else{
                throw new Error('error on validation')
            }

            
        } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
    }
    verifyRefreshToken(token:string,from:string){
     
        try { 
             if(from==='user'){
                const decode=jwt.verify(token,process.env.JWT__REFRESH_SECRET_USER||'123')
                
                if(decode){
                const parsed=decode as IJwtInterface
                return parsed.id.slice(1,25)
                }
                return decode
            }else{
                throw new Error('error on token verification')
            }  
        } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
    }
    decodeAccessToken(token:string){
        try {
            const data:unknown=jwt.decode(token)
            if(typeof data==='object'){
                const parsed=data as IJwtInterface
              
                return parsed.id.slice(1,25)
            }else{
             throw new Error('error on id exraction')
            }
         } catch  {
           
             throw new Error('error on id exraction')
         }
    }
    decodeRefreshToken(token:string){
        try {
            const data:unknown=jwt.decode(token)
            if(typeof data==='object'){
                const parsed=data as IJwtInterface
                return parsed.id.slice(1,25)
            }else{
             throw new Error('error on id exraction')
            }
         } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
    }
   async fetchRefreshToken(extractId:unknown,token:string){
        try {
            if(!token||typeof token!=='string'||!extractId||typeof extractId!=='string'){
                throw new Error('refresh token not found')
            } 
            const response= await this.tokenRepo.fetchToken(extractId,token)
            return response   
        } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
        
    }
    async deleteRefreshToken(id:string,token:string){
        try {
            await this.tokenRepo.deleteToken(id,token)
        }catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
    }
    
}