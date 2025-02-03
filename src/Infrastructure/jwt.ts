import jwt from 'jsonwebtoken'
import { jwtInterface } from '../interface/middlewares/jwtUser.js'
import { TokenRepository } from './repositories/otherRepo.js'
import { Types } from 'mongoose'
import { JwtServiceInterface } from '../types/serviceLayerInterfaces.js'



export class JWTAdapter implements JwtServiceInterface{
    private tokenRepo:TokenRepository
    constructor (tokenRepo: TokenRepository){
        this.tokenRepo=tokenRepo
    }
    createAccessToken(information:{id:string,role:string,preferedGender?:string,gender?:string},key:string,option:{expiresIn:string}){
        try {
            
            const {id,role,preferedGender='no parnter',gender='not available'} =information
           const token= jwt.sign({id,role,preferedGender,gender},key,option)
            return  token
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
   async createRefreshToken(information:{id:string,role:string},key:string,option:{expiresIn:string}){
        try {
            
            const {id,role} =information
           const token= jwt.sign({id,role},key,option)
            await this.tokenRepo.create({userId:new Types.ObjectId(id.slice(1,25)),token:token})
            return  token
        } catch (error:any) {
            console.log(error)
            throw new Error(error.message)
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

            
        } catch (error:any) {
           throw new Error(error.message) 
        }
    }
    verifyRefreshToken(token:string,from:string){
     
        try { 
             if(from==='user'){
                const decode=jwt.verify(token,process.env.JWT__REFRESH_SECRET_USER||'123')
                
                if(decode){
                const parsed=decode as jwtInterface
                return parsed.id.slice(1,25)
                }
                return decode
            }else{
                throw new Error('error on token verification')
            }  
        } catch (error:any) {
            console.log(error)
           throw new Error(error.message) 
        }
    }
    decodeAccessToken(token:string){
        try {
            const data:unknown=jwt.decode(token)
            if(typeof data==='object'){
                const parsed=data as jwtInterface
              
                return parsed.id.slice(1,25)
            }else{
             throw new Error('error on id exraction')
            }
         } catch (error) {
            console.log(error)
             throw new Error('error on id exraction')
         }
    }
    decodeRefreshToken(token:string){
        try {
            const data:unknown=jwt.decode(token)
            if(typeof data==='object'){
                const parsed=data as jwtInterface
                return parsed.id.slice(1,25)
            }else{
             throw new Error('error on id exraction')
            }
         } catch (error) {
             throw new Error('error on id exraction')
         }
    }
   async fetchRefreshToken(extractId:unknown,token:string){
        try {
            if(!token||typeof token!=='string'||!extractId||typeof extractId!=='string'){
                throw new Error('refresh token not found')
            } 
            const response= await this.tokenRepo.fetchToken(extractId,token)
            return response   
        } catch (error:any) {
           throw new Error(error) 
        }
        
    }
    async deleteRefreshToken(id:string,token:string){
        try {
            await this.tokenRepo.deleteToken(id,token)
        } catch (error:any) {
            throw new Error(error)
        }
    }
    
}