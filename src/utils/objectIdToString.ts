import { Types } from "mongoose";

export  function objectIdToString(id: unknown): string {
   if(id instanceof Types.ObjectId){

       return id.toString();  
   }else{
    throw new Error('internal server error on string parse')
   }
   
  }