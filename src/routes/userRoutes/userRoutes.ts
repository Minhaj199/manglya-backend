import {
  messageController,
  userAuthController,
  userController,
  acceptAndRejectDTOSchema,
  acssTknRenualDTOSchema,
  addMatchDtoSchema,
  createTextsDTOSchema,
  deleteMatchedUser,
  emailDtoSchema,
  firstBatchDataDtoSchema,
  fromValidatorDTOSchema,
  loginDtoSchema,
  messageViewedDTOSchema,
  otpCreationDtoSchema,
  otpDtoSchema,
  passResetProfileDTOSchema,
  passwordResetDTOSchema,
  purchasePlanDTOSchema,
  reportAbuserUserDTOSchema,
  secondBatchDtoSchema,
  userJwtAuthenticator,
  upload,
  Router,
} from "./index.ts";
import { dtoValidate } from "../adminRoute/index.ts";

const router = Router();

router.post("/login", dtoValidate(loginDtoSchema), userAuthController.login);
router.post(
  "/firstBatchData",
  dtoValidate(firstBatchDataDtoSchema),
  userAuthController.signup
);
router.get("/fetchforLanding", userController.fetchDataForProfile);
router.post(
  "/otpCreation",
  dtoValidate(otpCreationDtoSchema),
  userController.otpCreation
);
router.post(
  "/otpValidation",
  dtoValidate(otpDtoSchema),
  userController.otpValidation
);
router.patch(
  "/changePassword",
  dtoValidate(passwordResetDTOSchema),
  userAuthController.changePassword
);
router.post(
  "/forgotEmail",
  dtoValidate(emailDtoSchema),
  userAuthController.forgotCheckValidateSigunp
);
router.post(
  "/uploadProfile",
  upload.single("file"),
  dtoValidate(secondBatchDtoSchema),
  userController.secondBatch
);
router.get(
  "/forgotEmail",
  dtoValidate(otpCreationDtoSchema),
  userAuthController.forgotCheckValidate
);

router.post(
  "/addMatch",
  dtoValidate(addMatchDtoSchema),
  userJwtAuthenticator,
  userController.addMatch
);
router.patch(
  "/manageReqRes",
  dtoValidate(acceptAndRejectDTOSchema),
  userJwtAuthenticator,
  userController.manageReqRes
);
router.get(
  "/fetchProfile",
  userJwtAuthenticator,
  userController.fetchProfileData
);
router.get("/fetchPlanData", userController.fetchPlanData);
router.post(
  "/purchasePlan",
  dtoValidate(purchasePlanDTOSchema),
  userJwtAuthenticator,
  userController.purchasePlan
);

router.get("/getInterest", userController.fetchInterest);
router.get(
  "/getUserProfile",
  userJwtAuthenticator,
  userController.getUserProfile
);
router.post(
  "/otpRstPsword",
  userJwtAuthenticator,
  userController.otpForResetPassword
);
router.post(
  "/validateUserOTP",
  userJwtAuthenticator,
  userController.otpForUserResetPassword
);
router.patch(
  "/resetPassword",
  dtoValidate(passResetProfileDTOSchema),
  userJwtAuthenticator,
  userAuthController.resetPassword
);

router.delete(
  "/deleteMatched",
  dtoValidate(deleteMatchedUser),
  userJwtAuthenticator,
  userController.deleteMatched
);
router.put(
  "/editProfile",

  userJwtAuthenticator,
  upload.single("file"),
  userController.editProfile
);
router.get("/matchedUsers", userJwtAuthenticator, userController.matchedUser);
router.post(
  "/reportAbuse",
  dtoValidate(reportAbuserUserDTOSchema),
  userJwtAuthenticator,
  userController.reportAbuse
);
router.get(
  "/fetchSuggestion",
  userJwtAuthenticator,
  userController.fetchSuggestion
);

router.post("/getChats/:id", userJwtAuthenticator, messageController.getChats);
router.post(
  "/createChats",
  dtoValidate(createTextsDTOSchema),
  userJwtAuthenticator,
  messageController.createTexts
);

router.get(
  "/getMessages/:id",
  userJwtAuthenticator,
  messageController.getMessages
);
router.get(
  "/userForChat/:id",
  userJwtAuthenticator,
  messageController.getUserForChat
);
router.get(
  "/countMessages",
  dtoValidate(fromValidatorDTOSchema),
  userJwtAuthenticator,
  messageController.MsgCount
);
router.patch(
  "/messageReaded",
  dtoValidate(messageViewedDTOSchema),
  userJwtAuthenticator,
  messageController.MessageViewed
);
router.post(
  "/saveImage",
  userJwtAuthenticator,
  upload.single("file"),
  messageController.saveImage
);
router.post(
  "/getNewToken",
  dtoValidate(acssTknRenualDTOSchema),
  userAuthController.getNewToken
);
router.get(
  "/planHistoryAndRequest",
  userJwtAuthenticator,
  userController.planHistoryAndRequest
);

export default router;
