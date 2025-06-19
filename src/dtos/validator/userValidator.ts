import { array, boolean, number, string, z } from "zod";
import { ResponseMessage } from "../../constrain/ResponseMessageContrain";

///////////////////user signup first batch data/////////////////
export const firstBatchDataValidatorSchema= z.object({
  "FIRST NAME": z
    .string({ required_error: "first name required" })
    .min(3, "first name shoud be more thant 3")
    .max(10, "first name shoud be less than 10"),
  "SECOND NAME": z
    .string({ required_error: "second name required" })
    .min(1, "second name shoud be more thant ")
    .max(10, "first name shoud be less thant 10"),
  "DATE OF BIRTH": z
    .string({ required_error: "date of birth required" })
    .min(3, "not valid data of birth"),
  "DISTRICT THAT YOU LIVE": z
    .string({ required_error: "district name required" })
    .min(2, "not valid district"),
  "YOUR GENDER": z
    .string({ required_error: "your gender required" })
    .min(2, "not valid gender"),
  "GENDER OF PARTNER": z
    .string({ required_error: "partner gender required" })
    .min(3, "not valid partner gender"),
  EMAIL: z
    .string({ required_error: ResponseMessage.EMAIL_REQUIRED })
    .email(ResponseMessage.VALID_EMAIL),
  PASSWORD: z
    .string({ required_error: "passoword required" })
    .min(3, "not valid passwordz"),
});

////////////////////user loging//////////////
export const loginValidatorSchema= z.object({
  email: string({ required_error: ResponseMessage.EMAIL_REQUIRED }).email(
    ResponseMessage.VALID_EMAIL
  ),
  password: string({ required_error: "Password required" }).min(
    3,
    "enter a valid passoword"
  ),
});

////////////////////otp creation///////////////////
export const otpCreationValidatorSchema= z.object({
  email: string({ required_error: ResponseMessage.EMAIL_REQUIRED }).email(
    ResponseMessage.VALID_EMAIL
  ),
  from: string({ required_error: ResponseMessage.FROM_ARGUEMENT_MISSING }).min(
    3,
    ResponseMessage.FROM_ARGUEMENT_MISSING
  ),
});

/////////////////otp validation///////
export const otpValidatorSchema= z.object({
  email: string({ required_error: ResponseMessage.EMAIL_REQUIRED }).email(
    ResponseMessage.VALID_EMAIL
  ),
  from: string({ required_error: ResponseMessage.FROM_ARGUEMENT_MISSING }).min(
    3,
    ResponseMessage.FROM_ARGUEMENT_MISSING
  ),
  otp: string({ required_error: "otp requrired" })
    .min(6, "number should be 6 digits")
    .max(6, "number should be 6 digits"),
});

///////////pasword reset///////////
const passwordRegex = new RegExp(process.env.PASSWORD_REGEX!);
export const passwordResetValidatorSchema= z
  .object({
    email: string({ required_error: ResponseMessage.EMAIL_REQUIRED }).email(
      ResponseMessage.VALID_EMAIL
    ),
    password: string({ required_error: "password required" }).refine(
      (value) => passwordRegex.test(value),
      {
        message:
          "passoword not strong please add Upper,lower cases,number and special charetors",
        path: ["password"],
      }
    ),
    confirmPassword: string({ required_error: "confirm password required" }),
  })
  .refine(
    (data: { password: string; confirmPassword: string }) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

//////////////emial validation///////////
export const emailValidatorSchema= z.object({
  email: string({ required_error: ResponseMessage.EMAIL_REQUIRED }).email(
    ResponseMessage.VALID_EMAIL
  ),
});
export const secondBatchValidatorSchema= z.object({
  email: string({ required_error: ResponseMessage.EMAIL_REQUIRED }).email(
    ResponseMessage.VALID_EMAIL
  ),
  interest: z.string({ required_error: "interest required" }).refine(
    (val: string) => {
      try {
        const parserInterestArray = JSON.parse(val);

        if (!Array.isArray(parserInterestArray)) {
          return false;
        } else if (parserInterestArray.length <= 0) {
          return false;
        } else if (
          parserInterestArray.some((item) => typeof item !== "string")
        ) {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    },
    {
      message: "interest group not valid",
      path: ["interest"],
    }
  ),
});


///////////////////passowrd reset from profile update ////''
export const passResetProfileValidatorSchema= z
  .object({
    password: string({ required_error: "password required" }).refine(
      (value) => passwordRegex.test(value),
      {
        message:
          "passoword not strong please add Upper,lower cases,number and special charetors",
        path: ["password"],
      }
    ),
    confirmPassword: string({ required_error: "confirm password required" }),
  })
  .refine(
    (data: { password: string; confirmPassword: string }) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

////////////////////// getting new token after expired
export const acssTknRenualValidatorSchema= z.object({
  refresh: string({ required_error: "refresh token required" }).min(
    3,
    "valid refresh token missing"
  ),
});

///////////////// message making viewed /////////

export const messageViewedValidatorSchema= z.object({
  ids: array(string({ required_error: ResponseMessage.ID_NOT_FOUND }).min(1)),
  from: string({ required_error: ResponseMessage.FROM_ARGUEMENT_MISSING }).min(
    3,
    ResponseMessage.FROM_ARGUEMENT_MISSING
  ),
});

///////////////from parameter checker
export const fromValidatorSchemaValidatorSchema= z.object({
  from: string({ required_error: ResponseMessage.FROM_ARGUEMENT_MISSING }).min(
    3,
    ResponseMessage.FROM_ARGUEMENT_MISSING
  ),
});
/////////////////crteatNew text message////////////

export const createTextsValidatorSchema= z.object({
  chatId: string({ required_error: "chat id required" }).min(
    3,
    "not valid chatID"
  ),
  senderIdString: string({ required_error: "sender id required" }).min(
    3,
    "not valid sender id"
  ),
  receiverId: string({ required_error: "reciever required" }).min(
    3,
    "not valid reciever id"
  ),
  text: string({ required_error: "blank not allowed" }),
  image: boolean(),
});

/////////////////// payement process///////////////
export const purchasePlanValidatorSchema= z.object({
  planData: z.object({
    _id: string({ required_error: "plan id requred" }),
    name: string({ required_error: "plan name requred" }),
    duration: number(),
    features: array(string(string({ required_error: "featurs  requred" }))),
    amount: number(),
    connect: number(),
  }),
  token: z.any(),
});

////////////////report abuse user side/////////////

export const reportAbuserUserValidatorSchema= z.object({
  profileId: string({ required_error: "profile id required" }).min(
    3,
    "enter a valid id"
  ),
  reason: string({ required_error: "reason required" }).min(
    3,
    "inter a valid reason"
  ),
  moreInfo: string({ required_error: "more info required" }).min(
    3,
    "provide more info"
  ),
});

////////////add match dto//////////////

export const addMatchValidatorSchema= z.object({
  matchId: string({ required_error: "mached id required" }).min(
    3,
    "valid match id required"
  ),
});

export const acceptAndRejectValidatorSchema= z.object({
  id: string({ required_error: "requester id required" }).min(
    3,
    "valid requester id required"
  ),
  action: string({ required_error: "action required" }).min(
    3,
    "valid action required"
  ),
});

/////////////////delte matched //////////////

export const deleteMatchedUserSchema = z.object({
  id: array(
    string({ required_error: ResponseMessage.ID_NOT_FOUND }).min(
      1,
      "id not foudn"
    )
  ),
});

////////////// edit profile ///////
const PersonalInfoSchema = z.object({
  firstName: z.string({required_error: "first name string type expected"}).optional(),
  secondName: z.string({
      required_error: "last name string type expected",
    }).optional(),
  state: z.string({ required_error: "state string type expected" }).optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string({
      required_error: "date of birth date type expected",
    }).optional(), 
  image: z.string({ required_error: "image string type expected" }).optional(),
  interest: z.array(z.string()).nullable().optional(),
  photo: z.any().nullable().optional(),
}).partial();
const PartnerDataSchema = z.object({
  gender: z.string({ required_error: "paterner gender string type expected" }).optional(),
}).partial();
 export const ProfileUpdateValidatorSchema = z.object({
  PersonalInfo: PersonalInfoSchema.optional(),
  partnerData: PartnerDataSchema.optional(),
  email: z.string().refine((val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email",
  }).optional(),
  subscriber: z.string({ required_error: "subscriber string type expected" }).optional(),
});