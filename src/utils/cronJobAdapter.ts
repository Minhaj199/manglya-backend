import { CronJob } from "cron";
import { CronService } from "../services/implimentaion/cronService";
import { UserRepsitories } from "../repository/implimention/userRepository";

const cronService = new CronService(new UserRepsitories());
export const job = new CronJob("0 0 0/24 * * *", () => {
  try {
    cronService.checkExpiration();
  } catch {
    throw new Error("erron cron job");
  }
});
