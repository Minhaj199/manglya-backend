
import { Features } from "../../Infrastructure/db/featureModel.js"
import { InterestInterface, PlanOrder, PlanOrderMongo, RefeshToken, RefreshWithPopulatedData } from "../../types/TypesAndInterfaces.js"

export interface BaseRepositoryInterface{
    create(data: Partial<unknown>): Promise<unknown>
}
export interface PurchasedPlanInterface{
    create(data:PlanOrderMongo):Promise<PlanOrderMongo>
    fetchRevenue(): Promise<number>
    fetchHistory(id: string): Promise<PlanOrder[]>
}
export interface OtherRepositoriesInterface{
    create(data:InterestInterface):Promise<InterestInterface>
    getInterest(): Promise<string[]>
    getInterestAsCategory():Promise<InterestInterface|null>
   
}
export interface FeaturesRepositoryInterface{
    create(data:Features):Promise<Features>
    isExits():Promise<boolean>
    fetchFeature():Promise<{ features: Features}|null>
}
export interface RefreshTokenInterface{
    create(data:RefeshToken):Promise<RefeshToken>
    fetchToken(extractId:string,refreshToken:string): Promise<RefreshWithPopulatedData|null>
    deleteToken(id: string,token:string): Promise<void>
}