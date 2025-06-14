import { User } from "../../types/UserRelatedTypes"; 
import { IFirstBatch } from "../../types/UserRelatedTypes"; 

export interface IAuthSevice {

  signupFirstBatch(
    firstBatch: IFirstBatch
  ): Promise<{ user: User; token: string; refreshToken: string }>;
  login(
    email: string,
    password: string
  ): Promise<{
    token: string;
    refresh: string;
    name: string;
    partner: string;
    photo: string;
    gender: string;
    subscriptionStatus: string;
  }>;
  passwordChange(email: string, password: string): Promise<boolean>;
  changePasswordEditProfile(password: unknown,confirmPassword:unknown,id: unknown): Promise<boolean>;
  regenerateToken(
    id: unknown,
    role: "user" | "admin",
    preferedGender: string,
    gender: string
  ): string;
  getNewToken(refreshToken: string): Promise<string>;
  userLoggedOut(id: unknown, token: unknown): Promise<void>;
}