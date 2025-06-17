import { IAbuseMessageDTO } from "../types/dtoTypesAndInterfaces";
import { IReportAbuseOutput, IReportAbuserMongoDoc} from "../types/TypesAndInterfaces";

export class AbuseMessageDTO implements IAbuseMessageDTO{
        messagesDatas:IReportAbuseOutput[]
    constructor(private readonly messageData:IReportAbuserMongoDoc[]|[]){
        this.messagesDatas=this.messageData?.map((elem:IReportAbuserMongoDoc)=>{
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
                  createdAt:elem.createdAt
            }
        })||[]
    }
}
