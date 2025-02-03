import { PurchasedPlan } from "../../Infrastructure/repositories/orderRepository.js";
import { UserRepsitories } from "../../Infrastructure/repositories/userRepository.js";
import { AdminDashServiceInterface } from "../../types/serviceLayerInterfaces.js";

export class DashService implements AdminDashServiceInterface {
  private userRepo: UserRepsitories;
  private purchaseRepo: PurchasedPlan;
  constructor(userRepo: UserRepsitories, purchaseRepo: PurchasedPlan) {
    this.userRepo = userRepo;
    this.purchaseRepo = purchaseRepo;
  }
  async totalRevenue() {
    try {
      return await this.purchaseRepo.fetchRevenue();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async dashCount() {
    try {
      const data: {
        subscriberGroups: { _id: string; count: number }[];
        totalCount: number;
      } = await this.userRepo.getDashCount();
      let ans = { subscriber: 0, notSubscriber: 0 };
      if (data?.subscriberGroups.length) {
        data.subscriberGroups.forEach((el: { _id: string; count: number }) => {
          if (el._id === "subscribed" || el._id === "connection finished") {
            ans.subscriber += el.count;
          } else {
            ans.notSubscriber += el.count;
          }
        });
      }

      const planRevenue = await this.totalRevenue();
      return {
        MonthlyRevenue: planRevenue,
        SubscriberCount: ans.subscriber,
        UserCount: data.totalCount,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async SubscriberCount() {
    try {
      const data = await this.userRepo.getSubcriberCount();

      let ans = { subscriber: 0, notSubscriber: 0 };
      if (data?.length) {
        data.forEach((el: { _id: string; count: number }) => {
          if (el._id === "subscribed" || el._id === "connection finished") {
            ans.subscriber += el.count;
          } else {
            ans.notSubscriber += el.count;
          }
        });
      }
      const response = [];
      response[0] = parseFloat(
        ((ans.subscriber / (ans.notSubscriber + ans.subscriber)) * 100).toFixed(
          2
        )
      );
      response[1] = parseFloat(
        (
          (ans.notSubscriber / (ans.notSubscriber + ans.subscriber)) *
          100
        ).toFixed(2)
      );

      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async revenueForGraph() {
    try {
      const result = await this.userRepo.getRevenue();
      const month: string[] = [];
      const total: number[] = [];
      if (result.length) {
        result.forEach((el) => {
          month.push(el?._id.slice(5));
          total.push(el?.total);
        }, []);
      }

      return { month: month, revenue: total };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
