import { OtpEntity } from "../../types/TypesAndInterfaces.ts";
import { generateOTP } from "../../utils/otpGenerator.ts";
import { IOtpService } from "../interfaces/IOtpService.ts";
import { IUserRepository } from "../../repository/interface/IUserRepository.ts";
import { IOTPrespository } from "../../repository/interface/IOtpRepsitory.ts";
import { IEmailService } from "../../types/TypesAndInterfaces.ts";
export class OtpService implements IOtpService {
  private userRepository: IUserRepository;
  private otpRepository: IOTPrespository;
  private emailService: IEmailService;
  constructor(
    userRepository: IUserRepository,
    otpRepository: IOTPrespository,
    emailService: IEmailService
  ) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
    this.emailService = emailService;
  }
  async ForgetValidateEmail(email: string) {
    try {
      const isValid = await this.userRepository.fetchEmail(email);
      if (isValid) {
        return isValid?.email;
      } else {
        return null;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
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
      if (isCreated) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async otpVerificationForForgot(email: unknown, from: string) {
    try {
      if (!email || typeof email !== "string") {
        throw new Error("Email not found");
      }
      const isValid = await this.ForgetValidateEmail(email);
      if (!isValid) {
        return false;
      }
      const otp = await generateOTP();
      const otpReponse = await this.otpRepository.create({
        otp,
        email,
        from: from,
      });
      const subject = "Password Reseting";
      await this.emailService.sendEmail(
        email,
        subject,
        `Welcome to Mangalya. Your password reset OTP for Authentication is <h1>${otp}<h1/>`
      );
      return otpReponse ? true : false;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async otpValidation(email: string, otp: string, from: string) {
    try {
      const response = await this.otpRepository.fetchOTP(email, from);

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
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async otpDispatchingForEditProfile(id: unknown) {
    try {
      if (typeof id !== "string") {
        throw new Error("Invalid ID format");
      }

      const getEmail = await this.userRepository.fetchEmailByID(id);
      if (!getEmail) {
        throw new Error("Email not found");
      }

      const sentEmail = await this.otpVerificationForForgot(
        getEmail.email,
        "forgot"
      );

      await Promise.all([getEmail, sentEmail]);

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async validateOtpForEditProfiel(id: unknown, otp: unknown, from: string) {
    if (typeof id !== "string" || typeof otp !== "string") {
      throw new Error("error on validation");
    }
    try {
      const email: { email: string } = await this.userRepository.fetchEmailByID(
        id
      );
      if (email?.email) {
        const isValid: OtpEntity | [] = await this.otpRepository.fetchOTP(
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
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
}
