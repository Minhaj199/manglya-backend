import { Request,Response,NextFunction } from "express"
import { Jwt } from "jsonwebtoken"
import { JWTAdapter } from "../../Infrastructure/jwt.js"
import { TokenRepository } from "../../Infrastructure/repositories/otherRepo.js"
export interface jwtInterface{
    id: string, role: string, iat?: number, exp?: number 
}
const jwtAdmpter=new JWTAdapter(new TokenRepository)
export const adminJwtAuthenticator=(req:Request,res:Response,next:NextFunction)=>{
  
  
   
                


const token=req.headers['authorizationforadmin']

if(token&&typeof token==='string'){
    try {
        const decode= jwtAdmpter.verifyAccessToken(token,'admin')
        const isValid=decode as jwtInterface
        if(typeof decode==='string'){
            res.json({message:'token is not valid',name:'authentication failed'})
        } const currentTime = Math.floor(Date.now() / 1000);
        if(isValid&&isValid.id==='123'&&isValid.role==='admin'){
            if(isValid.exp&&isValid.exp>currentTime){                       
                next()
              
            }else{
                res.json({message:'validation Faild',name:'authentication failed'})
               
            }
        }
        else{
            res.json({message:'validation Faild',name:'authentication failed'})
            
        }
    } catch (error:unknown) {
        if(error instanceof Error){
            
            res.status(405).json({message:error.message||'validation Faild',name:'authentication failed'})
        }else{
            console.log('error is not getting')
        }
    }

        
        
       
      
    }else{
   
        res.status(405).json({message:'validation Faild',name:'authentication failed' })
    
    }
}