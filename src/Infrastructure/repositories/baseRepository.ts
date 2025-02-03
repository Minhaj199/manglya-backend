import { Document, Model } from "mongoose";
import { BaseRepositoryInterface } from "../../domain/interface/otherRepositories.js";


export default abstract class BaseRepository<T extends Document> implements BaseRepositoryInterface{
    constructor(protected model:Model<T>){}
        async create(data:Partial<T>):Promise<T>{

            try {
                const doc=new this.model(data)
                return (await doc.save()).toObject()
            } catch (error:any) {
                if(error?.code&&error.code===11000){
                    throw new Error('Name already exists')
                }else{
                    
                    throw new Error(error.message||'Error on data fetching')
        
                }
            }
        }
    
}
