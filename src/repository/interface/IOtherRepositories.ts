import { Types } from "mongoose";
import {
  IFeatures,
  IInterestInput,
  IInterestInterface,
  IPlanOrder,
  IPlanOrders,
  IRefeshToken,
  IRefreshWithPopulatedData,
  PlanOrderMongo,
} from "../../types/TypesAndInterfaces";

export interface IBaseRepository {
  create(data: Partial<unknown>): Promise<unknown>;
}
export interface IPurchasedPlan {
  create(data: IPlanOrders<Types.ObjectId>): Promise<PlanOrderMongo>;
  fetchRevenue(): Promise<number>;
  fetchHistory(id: string): Promise<IPlanOrder[]>;
}
export interface IOtherRepositories {
  create(data: IInterestInput): Promise<IInterestInterface>;
  fetchInterest(): Promise<string[]>;
  fetchInterestAsCategory(): Promise<IInterestInterface | null>;
  isExist(): Promise<IInterestInterface>;
}
export interface IFeaturesRepository {
  create(data: { features: string[] }): Promise<IFeatures>;
  isExits(): Promise<boolean>;
  fetchFeature(): Promise<{ features: IFeatures } | null>;
}
export interface IRefreshToken {
  create(data: IRefeshToken): Promise<IRefeshToken>;
  fetchToken(
    extractId: string,
    refreshToken: string
  ): Promise<IRefreshWithPopulatedData | null>;
  deleteToken(id: string, token: string): Promise<void>;
}
