import {
  addPlanDtoSchema,
  blockAndUnblockDtoSchema,
  editPlanDtoShema,
  reportAbuseActionDtoSchema,
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
  dtoValidate(addPlanDtoSchema),
  adminController.addPlan
);
router.patch(
  "/block&Unblock/:id",
  dtoValidate(blockAndUnblockDtoSchema),
  adminController.userBlockAndUnblock
);
router.post(
  "/insertPlan",
  adminJwtAuthenticator,
  dtoValidate(addPlanDtoSchema),
  adminController.addPlan
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
  dtoValidate(reportAbuseActionDtoSchema),
  reportAbuseController.sendWarningMails
);
router.patch(
  "/blockAbuser/:id",
  adminJwtAuthenticator,
  dtoValidate(reportAbuseActionDtoSchema),
  reportAbuseController.blockAbuser
);
router.get(
  "/getReports",
  adminJwtAuthenticator,
  reportAbuseController.getReports
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
