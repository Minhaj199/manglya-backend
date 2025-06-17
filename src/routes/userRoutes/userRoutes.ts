import {
  messageController,
  userAuthController,
  userController,
  acceptAndRejectValidator,
  acssTknRenualValidator,
  addMatchValidator,
  createTextsValidator,
  emailValidator,
  firstBatchDataValidator,
  fromValidatorValidator,
  loginValidator,
  messageViewedValidator,
  otpCreationValidator,
  otpValidator,
  passResetProfileValidator,
  passwordResetValidator,
  purchasePlanValidator,
  reportAbuserUserValidator,
  secondBatchValidator,
  userJwtAuthenticator,
  upload,
  Router,
} from "./index.ts";
import { dtoValidate } from "../adminRoute/index.ts";

const router = Router();

router.post("/login", dtoValidate(loginValidator), userAuthController.login);
router.post(
  "/firstBatchData",
  dtoValidate(firstBatchDataValidator),
  userAuthController.signup
);
router.get("/fetchforLanding", userController.fetchDataForProfile);
router.post(
  "/otpCreation",
  dtoValidate(otpCreationValidator),
  userController.otpCreation
);
router.post(
  "/otpValidation",
  dtoValidate(otpValidator),
  userController.otpValidation
);
router.patch(
  "/changePassword",
  dtoValidate(passwordResetValidator),
  userAuthController.changePassword
);
router.post(
  "/forgotEmail",
  dtoValidate(emailValidator),
  userAuthController.forgotCheckValidateSigunp
);
router.post(
  "/uploadProfile",
  upload.single("file"),
  dtoValidate(secondBatchValidator),
  userController.secondBatch
);
router.get(
  "/forgotEmail",
  dtoValidate(otpCreationValidator),
  userAuthController.forgotCheckValidate
);

router.post(
  "/addMatch",
  dtoValidate(addMatchValidator),
  userJwtAuthenticator,
  userController.addMatch
);
router.patch(
  "/manageReqRes",
  dtoValidate(acceptAndRejectValidator),
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
  dtoValidate(purchasePlanValidator),
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
  dtoValidate(passResetProfileValidator),
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
  dtoValidate(reportAbuserUserValidator),
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
  dtoValidate(createTextsValidator),
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
  dtoValidate(fromValidatorValidator),
  userJwtAuthenticator,
  messageController.MsgCount
);
router.patch(
  "/messageReaded",
  dtoValidate(messageViewedValidator),
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
  dtoValidate(acssTknRenualValidator),
  userAuthController.genetateNewToken
);
router.get(
  "/planHistoryAndRequest",
  userJwtAuthenticator,
  userController.planHistoryAndRequest
);

export default router;
