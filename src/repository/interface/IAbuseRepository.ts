import {  IAbuserMongoDoc, IAbuserReport } from "../../types/TypesAndInterfaces.ts"





export interface IReportAbuserRepository{
    findComplain(id:string,reason:string,profileId:string):Promise<IAbuserMongoDoc|null>
    getMessages():Promise<IAbuserMongoDoc[]|[]>
    create(data:IAbuserReport):Promise<IAbuserMongoDoc>,
    update(id:string,field:string,change:string|boolean):Promise<boolean>
    delete(id:string):Promise<boolean>
}