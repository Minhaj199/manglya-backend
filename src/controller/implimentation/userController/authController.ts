import { NextFunction, Request, Response } from "express";
import { IAuthController } from "../../interface/IUserController";
import { ResponseMessage } from "../../../constrain/ResponseMessageContrain";
import { HttpStatus } from "../../../constrain/statusCodeContrain";
import { userIDValidator } from "../../../utils/userIDValidator";
import { AppError } from "../../../types/customErrorClass";
import { IAuthSevice } from "../../../services/interfaces/IAuthSerivce";
import { IOtpService } from "../../../services/interfaces/IOtpService";

export class UserAuthController implements IAuthController {
 constructor( private readonly authService: IAuthSevice,private readonly otpService: IOtpService){

 }

  signup = async (req: Request, res: Response, next: NextFunction) => {
     try {
       const user: { token: string; refreshToken: string } =
         await this.authService.signupFirstBatch(req.body);
       res.setHeader("authorizationforuser", user?.refreshToken);
       res.status(HttpStatus.CREATED)
         .json({
           message: ResponseMessage.USER_CREATION_SUCCESS,
           token: user?.token,
         });
     } catch (error: unknown) {
       next(error);
     }
   };
     login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const response = await this.authService.login(email, password);
      const {
        token,
        refresh,
        name,
        photo,
        partner,
        gender,
        subscriptionStatus,
      } = response;
      res.setHeader("authorizationforuser", refresh);

      res.status(HttpStatus.OK).json({
        message: "password matched",
        token,
        refresh,
        name,
        photo,
        partner,
        gender,
        subscriptionStatus,
      });
    } catch (error: unknown) {
      next(error);
    }
  };
   forgotCheckValidate = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const response = await this.otpService.otpVerificationForForgot(
          req.query.email,
          "forgot"
        );
        if (response) {
          res.json({ email: req.query.email });
        } else {
          res.status(HttpStatus.OK).json(response);
        }
      } catch (error) {
        next(error);
      }
    };
    forgotCheckValidateSigunp = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const { email } = req.body;
        const isValid = await this.otpService.ForgetValidateEmail(email);
        if (isValid) {
          res.json({ email: isValid });
        } else {
          res.json(false);
        }
      } catch (error) {
        next(error);
      }
    };
    changePassword = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
          const { password, email } = req.body;
          const isValid = await this.authService.passwordChange(email, password);
          if (isValid) {
            res.json({ message: "password changed" });
          } else {
            res.json({ message: "error on password" });
          }
        } catch (error) {
          next(error);
        }
      };
      
          getNewToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.authService.getNewToken(req.body.refresh);
      if (response) {
        res.status(HttpStatus.OK).json({ token: response });
      } else {
        throw new Error("refresh token not found");
      }
    } catch (err) {
      next(err);
    }
  };
   resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!userIDValidator(req.userID)) {
        throw new AppError(ResponseMessage.ID_NOT_FOUND, 404);
      }
      const { password, confirmPassword } = req.body;
      const response = await this.authService.changePasswordEditProfile(
        password,
        confirmPassword,
        req.userID
      );
      res.json({ status: response });
    } catch (error) {
      if (error instanceof Error) {
        const err = new AppError(error.message);
        next(err);
      }
    }
  };
}
