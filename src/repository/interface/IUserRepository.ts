import {User, UserLinsting} from '../../types/UserRelatedTypes.ts'
import { CurrentPlanReturnType, IAdminPlanType, IFindCurrentPlanAndRequests, IMatchedProfileType, IPlanOrder, IProfileTypeFetch, IRequestInterface, ISuggestion, IUserCurrentPlan } from "../../types/TypesAndInterfaces.ts";
import { ILandingShowUesrsInterface, IUserWithID,  UpdatedData } from "../../types/UserRelatedTypes.ts";
import { Types } from 'mongoose';




export interface IUserRepository{
    create(user:User):Promise<IUserWithID>;
    findByEmail(email:string):Promise<IUserWithID|null>
    update(user:UpdatedData,id:string):Promise<IUserWithID>
    addPhoto(photo:string,email:string):Promise<boolean>
    addInterest(interst:string[],email:string):Promise<boolean>
    addMatch(userId:string,matchedId:string,user:IUserWithID):Promise<boolean>
    manageReqRes(requesterId:string,userId:string,action:string):Promise<boolean>
    getUsers():Promise<ILandingShowUesrsInterface[]|[]>
    findEmailByID(id:unknown):Promise<{email:string}>
    getUserProfile(id:string):Promise<IUserWithID>
    getDashCount():Promise<{subscriberGroups:{ _id:string, count:number}[],totalCount:number}>
    getSubcriberCount():Promise<{_id:string,count:number}[]>
    getRevenue():Promise<{ _id:string, total: number }[]>
    getMatchedRequest(id:string):Promise<IMatchedProfileType[]|[]>
    deleteMatched(id:string,matched:string):Promise<boolean>
    changePassword(email:string,hashedPassword:string):Promise<boolean>
    fetchPartnerProfils(userId:string,userGender:string,partnerGender:string):Promise<{profile:IProfileTypeFetch,request:IProfileTypeFetch}[]>
    getCurrentPlan(userId:string):Promise<{CurrentPlan:IUserCurrentPlan}[]|[]>
    addPurchaseData(userId:string,id:string,data:IPlanOrder):Promise<boolean>
    fetchSuggetions(id:string,gender:string,partnerPreference:string):Promise<{profile:ISuggestion[]|[],request:IProfileTypeFetch|[],userProfile:IUserWithID[]|[]}[]>
    createRequest(id:string):Promise<IRequestInterface[]>
    findEmail(email:string):Promise<IUserWithID|null>
    makeUserPlanExpire(currentDate:Date):Promise<void>
    fetchName(id:string):Promise<string>
    fetchUserDataForAdmin(): Promise<UserLinsting>
    fetchSubscriber():Promise<IAdminPlanType[]|[]>
    blockAndUnblockUser(id:string,action:boolean):Promise<boolean>
    findPartnerIds(id: string): Promise< { match: { _id:Types.ObjectId }}[]>
    findCurrentPlanAndRequests(id: string): Promise<{
        request: IFindCurrentPlanAndRequests[]
        plan:CurrentPlanReturnType
    }>
}
