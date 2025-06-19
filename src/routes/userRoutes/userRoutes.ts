import {
  messageController,
  userAuthController,
  userController,
 acceptAndRejectValidatorSchema,
  acssTknRenualValidatorSchema,
  addMatchValidatorSchema,
  createTextsValidatorSchema,
  emailValidatorSchema,
  firstBatchDataValidatorSchema,
  fromValidatorSchemaValidatorSchema,
  loginValidatorSchema,
  messageViewedValidatorSchema,
  otpCreationValidatorSchema,
  otpValidatorSchema,
  passResetProfileValidatorSchema,
  passwordResetValidatorSchema,
  purchasePlanValidatorSchema,
  reportAbuserUserValidatorSchema,
  userJwtAuthenticator,
  Router,
  secondBatchValidatorSchema,upload
} from "./index";
import { dtoValidate } from "../adminRoute/index";

const router = Router();

router.post("/login", dtoValidate(loginValidatorSchema), userAuthController.login);
router.post(
  "/firstBatchData",
  dtoValidate(firstBatchDataValidatorSchema),
  userAuthController.signup
);
router.get("/fetchforLanding", userController.fetchDataForProfile);
router.post(
  "/otpCreation",
  dtoValidate(otpCreationValidatorSchema),
  userController.otpCreation
);
router.post(
  "/otpValidation",
  dtoValidate(otpValidatorSchema),
  userController.otpValidation
);
router.patch(
  "/changePassword",
  dtoValidate(passwordResetValidatorSchema),
  userAuthController.changePassword
);
router.post(
  "/forgotEmail",
  dtoValidate(emailValidatorSchema),
  userAuthController.forgotCheckValidateSigunp
);
router.post(
  "/uploadProfile",
  upload.single("file"),
  dtoValidate(secondBatchValidatorSchema),
  userController.secondBatch
);
router.get(
  "/forgotEmail",
  dtoValidate(otpCreationValidatorSchema),
  userAuthController.forgotCheckValidate
);

router.post(
  "/addMatch",
  dtoValidate(addMatchValidatorSchema),
  userJwtAuthenticator,
  userController.addMatch
);
router.patch(
  "/manageReqRes",
  dtoValidate(acceptAndRejectValidatorSchema),
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
  dtoValidate(purchasePlanValidatorSchema),
  userJwtAuthenticator,
  userController.purchasePlan
);

router.get("/getInterest", userController.fetchInterest);
router.get(
  "/getUserProfile",
  userJwtAuthenticator,
  userController.fetchUserProfile
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
  dtoValidate(passResetProfileValidatorSchema),
  userJwtAuthenticator,
  userAuthController.resetPassword
);

router.delete(
  "/deleteMatched/:id",

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
  dtoValidate(reportAbuserUserValidatorSchema),
  userJwtAuthenticator,
  userController.reportAbuse
);
router.get(
  "/fetchSuggestion",
  userJwtAuthenticator,
  userController.fetchSuggestion
);

router.post("/getChats/:id", userJwtAuthenticator, messageController.fetchChats);
router.post(
  "/createChats",
  dtoValidate(createTextsValidatorSchema),
  userJwtAuthenticator,
  messageController.createTexts
);

router.get(
  "/getMessages/:id",
  userJwtAuthenticator,
  messageController.fetchMessages
);
router.get(
  "/userForChat/:id",
  userJwtAuthenticator,
  messageController.fetchUserForChat
);
router.get(
  "/countMessages",
  dtoValidate(fromValidatorSchemaValidatorSchema),
  userJwtAuthenticator,
  messageController.MsgCount
);
router.patch(
  "/messageReaded",
  dtoValidate(messageViewedValidatorSchema),
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
  dtoValidate(acssTknRenualValidatorSchema),
  userAuthController.genetateNewToken
);
router.get(
  "/planHistoryAndRequest",
  userJwtAuthenticator,
  userController.planHistoryAndRequest
);

export default router;
