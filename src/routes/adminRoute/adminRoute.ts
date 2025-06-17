import {
  addPlanValidator,
  blockAndUnblockValidator,
  editPlanDtoShema,
  reportAbuseActionValidator,
  reportAbuseRejectShema,
  adminController,
  reportAbuseController,
  abuseMessageToggleShema,
  dtoValidate,
  Router,
} from "./index.ts";
import { adminJwtAuthenticator } from "../../middlewares/jwtAdminMiddleware.ts";

const router = Router();

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
  dtoValidate(addPlanValidator),
  adminController.createPlan
);
router.patch(
  "/block&Unblock/:id",
  dtoValidate(blockAndUnblockValidator),
  adminController.userBlockAndUnblock
);
router.post(
  "/insertPlan",
  adminJwtAuthenticator,
  dtoValidate(addPlanValidator),
  adminController.createPlan
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
  dtoValidate(reportAbuseActionValidator),
  reportAbuseController.sendWarningMails
);
router.patch(
  "/blockAbuser/:id",
  adminJwtAuthenticator,
  dtoValidate(reportAbuseActionValidator),
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
