import { OtpEntity } from "../../domain/entity/otpEntity.js";
import {
  UserRepsitories,
} from "../../Infrastructure/repositories/userRepository.js";
import { generateOTP } from "../../interface/utility/otpGenerator.js";
import { EmailService } from "../../Infrastructure/emailService.js";
import { OtpRepository } from "../../Infrastructure/repositories/otpRepository.js";
import { OtpRepositoryInterface } from "../../types/serviceLayerInterfaces.js";
export class OtpService implements OtpRepositoryInterface {
  private userRepository: UserRepsitories;
  private otpRepository: OtpRepository;
  private emailService: EmailService;

  constructor(
    userRepository: UserRepsitories,
    otpRepository: OtpRepository,
    emailService: EmailService
  ) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
    this.emailService = emailService;
  }
  async ForgetValidateEmail(email: string) {
    try {
      const isValid = await this.userRepository.findEmail(email);
      return isValid;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async otpVerification(email: string, from: string) {
    try {
      const otp = await generateOTP();
      const isCreated = await this.otpRepository.create({ otp, email, from });
      await this.emailService.sendEmail(
        email,
        "Signup MANGALYA OTP",
        `Welcome to Mangalya. Your Signup OTP for Authentication is <h1>${otp}<h1/>`
      );
      if(isCreated){

        return true;
      }else{
        return false
      }
    } catch (error) {
      throw new Error("error on otp authentication");
    }
  }
  async otpVerificationForForgot(email: string, from: string) {
    try {
      const otp = await generateOTP();
      const otpReponse=await this.otpRepository.create({ otp, email, from: from });
      const subject = "Password Reseting";
      await this.emailService.sendEmail(
        email,
        subject,
        `Welcome to Mangalya. Your password reset OTP for Authentication is <h1>${otp}<h1/>`
      );
      if(otpReponse){

        return true;
      }else{
        return false
      }
    } catch (error) {
      throw new Error("error on otp authentication");
    }
  }
  async otpValidation(email: string, otp: string, from: string) {
    try {
      const response = await this.otpRepository.getOTP(email, from);
      if (Array.isArray(response)) {
        return false;
      } else {
        const parsedOTP = Number(otp);

        if (response.email === email && response.otp === parsedOTP) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      throw new Error("otp falure");
    }
  }
  async otpDispatchingForEditProfile(id: unknown) {
    try {
      if (typeof id !== "string") {
        throw new Error("Invalid ID format");
      }
  
      const getEmail = await this.userRepository.findEmailByID(id);
      if (!getEmail) {
        throw new Error("Email not found");
      }
  
      const sentEmail = await this.otpVerificationForForgot(getEmail.email, "forgot");
  
      await Promise.all([getEmail, sentEmail]);
  
      return true;  
    } catch (error: any) {
      console.error(error);
      return false; 
    }
  }
  async validateOtpForEditProfiel(id: unknown, otp: unknown, from: string) {
    if (typeof id !== "string" || typeof otp !== "string") {
      throw new Error("error on validation");
    }
    try {
      const email: { email: string } = await this.userRepository.findEmailByID(
        id
      );
      if (email?.email) {
        const isValid: OtpEntity | [] = await this.otpRepository.getOTP(
          email.email,
          from
        );

        if (Array.isArray(isValid)) {
          return "OTP not found";
        } else {
          const result = Number(otp || 123657) === isValid.otp;
          if (result) {
            return "opt matched";
          } else {
            return "Not valid otp";
          }
        }
      } else {
        throw new Error("internal server error,otp not found");
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
