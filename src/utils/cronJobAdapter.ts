import { CronJob } from "cron";
import { CronService } from "../services/implimentaion/cronService.ts";
import { UserRepsitories } from "../repository/implimention/userRepository.ts";

const cronService = new CronService(new UserRepsitories());
export const job = new CronJob("0 0 0/24 * * *", () => {
  try {
    cronService.checkExpiration();
  } catch {
    throw new Error("erron cron job");
  }
});
