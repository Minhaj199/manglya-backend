import {
  addPlanValidatorSchma,
  editPlanDtoShema,
  reportAbuseActionValidatorSchema,
  reportAbuseRejectShema,
  adminController,
  reportAbuseController,
  abuseMessageToggleShema,
  dtoValidate,
  Router,
  blockAndUnblockValidatorSchema,
} from "./index";
import { adminJwtAuthenticator } from "../../middlewares/jwtAdminMiddleware";

const router = Router();

router.post("/login", adminController.login);

//fetch data to user table
router.get("/fetchUserData", adminJwtAuthenticator, adminController.fetchData);
router.get(
  "/fetchPlanData",
  adminJwtAuthenticator,
  adminController.fetchPlanData
);
router.post(
  "/insertPlan",
  adminJwtAuthenticator,
  dtoValidate(addPlanValidatorSchma),
  adminController.createPlan
);
router.patch(
  "/block&Unblock/:id",
  adminJwtAuthenticator,
  dtoValidate(blockAndUnblockValidatorSchema),
  adminController.userBlockAndUnblock
);

router.put(
  "/editPlan/:id",
  adminJwtAuthenticator,
  dtoValidate(editPlanDtoShema),
  adminController.editPlan
);
router.patch("/removePlan/:id", adminJwtAuthenticator, adminController.softDlt);
router.get(
  "/fetchFeature",
  adminJwtAuthenticator,
  adminController.fetchFeature
);
router.get(
  "/getDataToDash",
  adminJwtAuthenticator,
  adminController.fetchDashData
);
router.patch(
  "/sendWarningMail/:id",
  adminJwtAuthenticator,
  dtoValidate(reportAbuseActionValidatorSchema),
  reportAbuseController.sendWarningMails
);
router.patch(
  "/blockAbuser/:id",
  adminJwtAuthenticator,
  dtoValidate(reportAbuseActionValidatorSchema),
  reportAbuseController.blockAbuser
);
router.get(
  "/getReports",
  adminJwtAuthenticator,
  reportAbuseController.fetchReports
);
router.patch(
  "/rejecReport/:id",
  adminJwtAuthenticator,
  dtoValidate(reportAbuseRejectShema),
  reportAbuseController.rejecReport
);
router.patch(
  "/reportToggle/:id",
  adminJwtAuthenticator,
  dtoValidate(abuseMessageToggleShema),
  reportAbuseController.reportToggle
);
router.delete(
  "/deleteMsg/:id",
  adminJwtAuthenticator,
  reportAbuseController.deleteMsg
);

export default router;
