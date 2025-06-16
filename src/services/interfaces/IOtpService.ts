export interface IOtpService {
  ForgetValidateEmail(email: unknown): Promise<string | null>;
  otpVerification(email: string, from: string): Promise<boolean>;
  otpVerificationForForgot(email: unknown, from: string): Promise<boolean>;
  otpValidation(email: string, otp: string, from: string): Promise<boolean>;
  otpDispatchingForEditProfile(id: unknown): Promise<boolean>;
  validateOtpForEditProfiel(
    id: unknown,
    otp: unknown,
    from: string
  ): Promise<string>;
}