import { IAbuseMessageDTO } from "../types/dtoTypesAndInterfaces";
import { IAbuserMongoDoc, IAbuserReport } from "../types/TypesAndInterfaces";

export class AbuseMessageDTO implements IAbuseMessageDTO{
        messagesDatas:IAbuserReport[]
    constructor(private readonly messageData:IAbuserMongoDoc[]|[]){
        this.messagesDatas=this.messageData?.map((elem:IAbuserMongoDoc)=>{
            return{
                _id:elem._id,
                reporter: elem.reporter,
                  reported: elem.reported,
                  read: elem.read,
                  reason: elem.reason,
                  moreInfo: elem.moreInfo,
                  warningMail: elem.warningMail,
                  block: elem.block,
                  rejected: elem.rejected,
            }
        })||[]
    }
}
