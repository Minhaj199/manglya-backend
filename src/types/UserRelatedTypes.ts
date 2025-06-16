import { Document, Types } from "mongoose";
import {
  IRefreshWithPopulatedData,
  IPlanOrdersEntity,
  Role,
} from "./TypesAndInterfaces";
import jwt from "jsonwebtoken";

export type IUserForLanding = {
  name: string;
  age: number;
  image: string;
};
export type UpdatedData = Record<string, string | Date | string[]>;

export interface IuserProfileReturnType {
  PersonalInfo: {
    age: number;
    firstName: string;
    secondName: string;
    state: string;
    gender: string;
    dateOfBirth: Date;
    image?: string;
    interest?: string[];
  };
  PartnerData: {
    gender: string;
  };
  Email: string;
  subscriptionStatus: string;
  currentPlan: IPlanOrdersEntity | undefined;
}

export type FetchDateForUserSelection = {
  id: Types.ObjectId;
  name: string;
  secondName: string;
  state: string;
  gender: string;
  dateOfBirth: Date;
}[];
export interface User {
  PersonalInfo: {
    firstName: string;
    secondName: string;
    state: string;
    gender: string;
    dateOfBirth: Date;
    image?: string;
    interest?: string[];
  };
  partnerData: {
    gender: string;
  };
  email: string;
  password: string;
  block: boolean;
  CurrentPlan?: IPlanOrdersEntity;
  PlanData?: string[];
  match: string[];
  subscriber: string;
  CreatedAt: Date;
}
export type PersonalInfoWithAge = Omit<User, "PersonalInfo" | "password"> & {
  PersonalInfo: {
    firstName: string;
    secondName: string;
    state: string;
    gender: string;
    dateOfBirth: Date;
    image?: string;
    interest?: string[];
    age: number;
  };
};

export type DataToBeUpdatedType = {
  PersonalInfo: {
    _id: string;
    firstName: string;
    secondName: string;
    state: string;
    gender: string;
    dateOfBirth: Date | string;
    interest: string[] | null;
  };
  partnerData: { gender: string };
  email: string;
};

export interface IUserWithID extends User, Document {}
export interface IFirstBatch {
  "SECOND NAME": string;
  "DATE OF BIRTH": string;
  "DISTRICT THAT YOU LIVE": string;
  "YOUR GENDER": string;
  "GENDER OF PARTNER": string;
  EMAIL: string;
  PASSWORD: string;
  "FIRST NAME": string;
}
export type signupSecondBatchResType = {
  url: string | boolean;
  responseFromAddinInterest: string | boolean;
};

export interface ILandingShowUesrsInterface {
  name: string;
  secondName: string;
  age: Date;
  image: string;
}
export interface IJwtService {
  createAccessToken(
    information: {
      id: string;
      role: Role;
      preferedGender?: string;
      gender?: string;
    },
    key: string,
    option: {
      expiresIn: string;
    }
  ): string;
  createRefreshToken(
    information: {
      id: string;
      role: Role;
    },
    key: string,
    option: {
      expiresIn: string;
    }
  ): Promise<string>;
  verifyAccessToken(token: string, from: string): string | jwt.JwtPayload;
  verifyRefreshToken(token: string, from: string): string | jwt.JwtPayload;
  decodeAccessToken(token: string): string;
  decodeRefreshToken(token: string): string;
  fetchRefreshToken(
    extractId: unknown,
    token: string
  ): Promise<IRefreshWithPopulatedData | null>;
  deleteRefreshToken(id: string, token: string): Promise<void>;
}

export type UserLinsting =
  | {
      username: string;
      email: string;
      match: { _id: string; status: string; typeOfRequest: string }[];
      subscriber: string;
      CreatedAt: Date;
      block: boolean;
    }[]
  | [];
