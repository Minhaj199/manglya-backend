import { IUserRepository } from "../../repository/interface/IUserRepository";
import { ICronServiceInterface } from "../interfaces/ICroneSevice";

export class CronService implements ICronServiceInterface {
  private userRepo: IUserRepository;
  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }
  async checkExpiration() {
    try {
      await this.userRepo.expireUserPlans(new Date);
    } catch  {
      throw new Error('error on cron job')
    }
  }
}
