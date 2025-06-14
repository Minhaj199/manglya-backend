import { AbuserMongoDoc } from "../../types/TypesAndInterfaces.ts"
import { AbuserReport } from "../../domain/entity/abuseEntiy.ts" 




export interface IReportAbuserRepository{
    findComplain(id:string,reason:string,profileId:string):Promise<AbuserMongoDoc|null>
    getMessages():Promise<AbuserReport[]|[]>
    create(data:AbuserReport):Promise<AbuserMongoDoc>,
    update(id:string,field:string,change:string|boolean):Promise<boolean>
    delete(id:string):Promise<boolean>
}