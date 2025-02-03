import { AbuserMongoDoc } from "../../types/TypesAndInterfaces.js"
import { AbuserReport } from "../entity/abuse.js"




export interface AbuserRepositoryInterface{
    findComplain(id:string,reason:string,profileId:string):Promise<AbuserMongoDoc|null>
    getMessages():Promise<AbuserReport[]|[]>
    create(data:AbuserReport):Promise<AbuserMongoDoc>,
    update(id:string,field:string,change:string|boolean):Promise<boolean>
    delete(id:string):Promise<boolean>
}