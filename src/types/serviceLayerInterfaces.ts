import { adminPlanType, ChatMessage, ExtentedMatchProfile, fetechProfileDataType, FirstBatch, IMessage, IMessageWithoutId,  MatchedProfile, PlanOrder, RefreshWithPopulatedData, RequestInterface, SubscriptionPlanDocument, suggestionType, updateData, UserCurrentPlan, userMgtUserfetchUserDatasForAdmin, userProfileReturnType, UserWithID } from "./TypesAndInterfaces.ts" 
import { User } from "../domain/entity/userEntity.ts"
import { Token } from '@stripe/stripe-js';
import { AbuserReport } from "../domain/entity/abuseEntiy.ts";
import { SubscriptionPlan } from "../domain/entity/PlanEntity.ts";
import { Features } from "../infrastructure/db/featureModel.ts";
import jwt from 'jsonwebtoken'


export interface AuthSeviceInteface{
    signupFirstBatch(firstBatch:FirstBatch):Promise<{user:User,token:string}>
    login(email:string,password:string):Promise<
    {token:string,refresh:string,name:string,partner:string,photo:string,gender:string,subscriptionStatus:string}
    >
    passwordChange(email:string,password:string):Promise<boolean>
    changePasswordEditProfile(password:unknown,id:unknown):Promise<boolean>
    regenerateToken(id:unknown,role:'user'|'admin',preferedGender:string,gender:string):string
    getNewToken(refreshToken: string): Promise<string>
    userLoggedOut(id: unknown,token:unknown): Promise<void>
}

export interface ChatServiceInterface{
    fetchChats(user:unknown,secondUser:unknown):Promise<{chatRoomId:string}>
    createMessage(chatRoomId: string,
        senderId: string,
        receiverId:string,
        text: string,
        image: boolean):Promise<IMessage>
    fetchUserForChat(id:string):Promise<{name:string,photo:string}>
    }
export interface FixedDataServiceInterface{
    creatInterest():Promise<void>
    createFeatures():Promise<void>
    fetchFeature(): Promise<{
        features: Features;
    } | null>
    fetchInterestAsCategory():Promise<{sports:string[],music:string[],food:string[]}|undefined> 
}
export interface PhotoServiceInterface{
    upload(path:string):string
}

export interface MessageServiceInterface{
    createMessage(data:IMessageWithoutId):Promise<IMessageWithoutId>
    findAllMessage(id:string):Promise<ChatMessage[]>
    updateReadedMessage(id:string):Promise<void>
    fetchMessageCount(from:unknown,id:unknown):Promise<{count:number,ids:string[]}>
    makeAllUsersMessageReaded(from:unknown,ids:string[]):Promise<boolean>
    createImageUrl(path:string):Promise<string>
}

export interface OtpRepositoryInterface{
    ForgetValidateEmail(email:string):Promise<UserWithID | null>
    otpVerification(email: string, from: string):Promise<boolean>
    otpVerificationForForgot(email: string, from: string):Promise<boolean>
    otpValidation(email: string, otp: string, from: string):Promise<boolean>
    otpDispatchingForEditProfile(id: unknown):Promise<boolean>
    validateOtpForEditProfiel(id: unknown, otp: unknown, from: string):Promise<string>
}
export interface ParnterServiceInterface{
    addMatch(userId: unknown, matchedId: string,): Promise<boolean>
    manageReqRes(requesterId: string, userId: unknown,action: string):Promise<boolean>
    fetchProfileData(userId:string,userGender:string,partnerGender:string):Promise<fetechProfileDataType>
    fetchUserForLandingShow():Promise< { name: string; age: number; image: string }[]|[]>
    matchedProfiles(id:unknown):Promise<MatchedProfile[] | { formatedResponse: ExtentedMatchProfile[]; Places: string[]; onlines: string[]; }>    
    deleteMatchedUser(userId:unknown,partnerId:string):Promise<boolean>
    createRequeset(id:string):Promise<RequestInterface[]>
}
export interface PaymentSeriviceInterface{
     purchase(plan:UserCurrentPlan,token:Token,email:string,userId:string):Promise<boolean>
}
export interface PlanServiceInterface {
    fetchAll():Promise<SubscriptionPlanDocument[] | []>
    createPlan(plan:SubscriptionPlan):Promise<SubscriptionPlanDocument|null>
    editPlan(data: SubscriptionPlanDocument): Promise<boolean>
    fetchHistory(id: string): Promise<PlanOrder[]>
}
export interface ReportAbuse{
    checkingDupliacateComplaint(id: string, reason: string, profileId: string): Promise<AbuserReport | null>
    createReport(userId: unknown, reporedId: string, reason: string, moreInfo: string): Promise<boolean>
}
export interface UserProfileSeriviceInterface{
    uploadPhoto(path: string, email: string): Promise<string | false>
    uploadInterest(intersts: string[], email: string): Promise<boolean>
    fetchUserProfile(id:unknown):Promise<userProfileReturnType>
    updateEditedData(data:updateData,id:unknown):Promise<{data:userProfileReturnType,token:string|boolean}>
    fetchUserByID(id:unknown):Promise<string>
    fetchName(id: string): Promise<string>
    fetchUserDatasForAdmin(): Promise<userMgtUserfetchUserDatasForAdmin[]>
    fetchSubscriberDetailforAdmin():Promise<{userData:adminPlanType[]|[],planData:{name:string}[]}>
    blockAndBlock(userId:string,action:boolean):Promise<boolean>
  
}
export interface AdminDashServiceInterface{
    totalRevenue(): Promise<number>
    dashCount(): Promise<{
        MonthlyRevenue: number;
        SubscriberCount: number;
        UserCount: number;
        
    }>
    SubscriberCount(): Promise<number[]>
    revenueForGraph(): Promise<{
        month: string[];
        revenue: number[];
    }>
}
export interface ReportAbuseServiceInterface{
    checkingDupliacateComplaint(id: string, reason: string, profileId: string): Promise<AbuserReport | null>
    createReport(userId: unknown, reporedId: string, reason: string, moreInfo: string): Promise<boolean>
    sendWarningMail(reporter: string, reported: string, reportId: string): Promise<boolean>
    blockReportedUser(reporter: string, reported: string, docId: string): Promise<boolean>
    getAllMessages(): Promise<[] | AbuserReport[]>
    rejectReport(reporter: string, reported: string, docId: string): Promise<boolean>
    toggleReportRead(id: string, status: boolean): Promise<boolean>
    deleteMessage(id: string): Promise<boolean>
}
export interface AdminAuthCase{
    login(email: string, password: string): {
        message: string;
        token: string;
    }
}
export interface JwtServiceInterface{
    createAccessToken(information: {
        id: string;
        role: string;
        preferedGender?: string;
        gender?: string;
    }, key: string, option: {
        expiresIn: string;
    }): string
    createRefreshToken(information: {
        id: string;
        role: string;
    }, key: string, option: {
        expiresIn: string;
    }): Promise<string>
    verifyAccessToken(token: string, from: string): string | jwt.JwtPayload
    verifyRefreshToken(token: string, from: string): string | jwt.JwtPayload
    decodeAccessToken(token: string): string
    decodeRefreshToken(token: string): string
    fetchRefreshToken(extractId: unknown, token: string): Promise<RefreshWithPopulatedData | null>
    deleteRefreshToken(id: string,token:string): Promise<void>
}

export interface BcryptAdapterInterface{
    hash(password: string): Promise<string>
    compare(password: string, hashed: string): Promise<boolean>
}
export interface CronServiceInterface{
    checkExperation(): Promise<void>
}