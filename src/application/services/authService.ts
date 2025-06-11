import { BcryptAdapter } from "../../infrastructure/bcryptAdapter.ts";
import { JWTAdapter } from "../../infrastructure/jwt.ts";
import { UserRepository } from "../../domain/interface/userRepository.ts";
import {
  FirstBatch,
  UserWithID,
} from "../../types/TypesAndInterfaces.js";
import { User } from "../../domain/entity/userEntity.js";
import dotEnv from "dotenv";
import { AuthSeviceInteface } from "../../types/serviceLayerInterfaces.ts";


dotEnv.config();

///////////////checking completed/////////////////

export class AuthService implements AuthSeviceInteface {
  private bcryptAdapter: BcryptAdapter;
  private jwtGenerator: JWTAdapter;
  private userRepository: UserRepository;

  constructor(
    userRepository: UserRepository,
    bcryptAdapter: BcryptAdapter,
    jwtGenerator: JWTAdapter
  ) {
    this.bcryptAdapter = bcryptAdapter;
    this.jwtGenerator = jwtGenerator;
    this.userRepository = userRepository;
  }
  async signupFirstBatch(firstBatch: FirstBatch) {
    const hashedPassoword = await this.bcryptAdapter.hash(firstBatch.PASSWORD);
    const user: User = {
      PersonalInfo: {
        firstName: firstBatch["FIRST NAME"],
        secondName: firstBatch["SECOND NAME"],
        state: firstBatch["DISTRICT THAT YOU LIVE"],
        gender: firstBatch["YOUR GENDER"],
        dateOfBirth: new Date(firstBatch["DATE OF BIRTH"]),
      },
      partnerData: {
        gender: firstBatch["GENDER OF PARTNER"],
      },
      email: firstBatch.EMAIL,
      password: hashedPassoword,
      block: false,
      match: [],
      PlanData: [],
      subscriber: "Not subscribed",
      CreatedAt: new Date(),
    };
    try {
      const response: UserWithID = await this.userRepository.create(user);
      if (response && response._id) {
        const key = process.env.JWT__ACCESS_SECRET_USER || "123";
        const id = JSON.stringify(response._id) || "123";
        const preferedGender = response.partnerData.gender;
        const gender = response.PersonalInfo.gender;
        const accessToken = this.jwtGenerator.createAccessToken(
          { id: id, role: "user", preferedGender, gender },
          key,
          { expiresIn: "15m" }
        );

        const refreshToken = await this.jwtGenerator.createRefreshToken(
          { id, role: "user" },
          process.env.JWT__REFRESH_SECRET_USER || "",
          { expiresIn: "1d" }
        );
        return { user, token: accessToken, refreshToken };
      } else {
        throw new Error("internal server error on signup");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new Error("user not found");
      }
      if (user) {
        const isMatch = await this.bcryptAdapter.compare(
          password,
          user.password
        );

        if (isMatch) {
          const preferedGender = user.partnerData.gender;
          const gender = user.PersonalInfo.gender;

          const jwt_access_key: string =
            process.env.JWT__ACCESS_SECRET_USER || "";
          const jwt_refresh_key: string =
            process.env.JWT__REFRESH_SECRET_USER || "";
          if (!jwt_access_key || jwt_access_key?.trim() === "") {
            throw new Error("user access key not found");
          }
          if (!jwt_refresh_key || jwt_refresh_key?.trim() === "") {
            throw new Error("user refresh` key not found");
          }
          const accessToken = this.jwtGenerator.createAccessToken(
            {
              id: JSON.stringify(user._id),
              role: "user",
              preferedGender,
              gender,
            },
            jwt_access_key,
            { expiresIn: "15m" }
          );
          const refreshToken = await this.jwtGenerator.createRefreshToken(
            { id: JSON.stringify(user._id), role: "user" },
            jwt_refresh_key,
            { expiresIn: "1d" }
          );

          const photo = user.PersonalInfo.image || "";
          return {
            token: accessToken,
            refresh: refreshToken,
            name: user.PersonalInfo.firstName,
            partner: user.partnerData.gender,
            photo: photo,
            gender: user.PersonalInfo.gender,
            subscriptionStatus: user.subscriber,
          };
        } else {
          throw new Error("password not matched");
        }
      } else {
        throw new Error("user not found");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async passwordChange(email: string, password: string) {
    if (!email || !password) {
      throw new Error("insuficient datas");
    }
    try {
      const hashed = await this.bcryptAdapter.hash(password);

      if (email && hashed) {
        const response = await this.userRepository.changePassword(
          email,
          hashed
        );

        return response;
      } else {
        throw new Error("error on password reseting");
      }
    } catch (error) {
      throw new Error("error on password reseting");
    }
  }

  async changePasswordEditProfile(password: unknown, id: unknown) {
    if (typeof password !== "string" || typeof id !== "string") {
      throw new Error("error on password changing");
    }
    try {
      const email: any = await this.userRepository.findEmailByID(id);

      if (!email) {
        throw new Error("error on password changing");
      }
      const response = await this.passwordChange(email?.email, password);
      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  regenerateToken(
    id: unknown,
    role: "user" | "admin",
    preferedGender: string,
    gender: string
  ) {
    if (typeof id !== "string") {
      throw new Error("error on id");
    }
    try {
      const information = {
        id,
        role,
        preferedGender,
        gender,
      };
      const newToken = this.jwtGenerator.createAccessToken(
        information,
        role === "admin"
          ? process.env.JWT_ACCESS_SECRET_ADMIN || ""
          : process.env.JWT__ACCESS_SECRET_USER || "",
        { expiresIn: "15m" }
      );
      return newToken;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }
  async getNewToken(refreshToken: string) {
    try {
      if (typeof refreshToken !== "string") {
        throw new Error("token not found");
      }
   
      const extractId = this.jwtGenerator.verifyRefreshToken(
        refreshToken,
        "user"
      );
   
      if (!extractId) {
        throw new Error("refresh token is not valid");
      }
      const token = await this.jwtGenerator.fetchRefreshToken(
        extractId,
        refreshToken
      );
      if (token) {
        const newToken = this.jwtGenerator.createAccessToken(
          {
            id: JSON.stringify(token.userId._id),
            role: "user",
            preferedGender: token.userId.partnerData.gender,
            gender: token.userId.PersonalInfo.gender,
          },
          process.env.JWT__ACCESS_SECRET_USER || "",
          { expiresIn: "15m" }
        );
        return newToken;
      } else {
        throw new Error("refreshTokenNotFount");
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async userLoggedOut(id: unknown,token:unknown) {
  
    try {
      if (!id || typeof id !== "string") {
        throw new Error("token not found");
      }
      if(!token||typeof token!=='string'){
        throw new Error("token not found")
      }
      await this.jwtGenerator.deleteRefreshToken(id,token);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
