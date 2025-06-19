import { IPlanDTO, planDTODataType } from "../types/dtoTypesAndInterfaces";
import {
  IAdminPlanType,
  ISubscriptionPlanDocument,
} from "../types/TypesAndInterfaces";

///////////////plan management page admin
export class PlanDTO implements IPlanDTO {
  plans: planDTODataType;
  constructor(planData: ISubscriptionPlanDocument[] | []) {
    this.plans =
      planData?.map((elem: ISubscriptionPlanDocument) => {
        return {
          _id: elem._id,
          name: elem.name,
          duration: elem.duration,
          features: elem.features,
          amount: elem.amount,
          connect: elem.connect,
        };
      }) || [];
  }
}

///////////////subscriber page admin//////////////////
export class SubscriberPlanDTO {
  planData: { name: string }[];
  userData: IAdminPlanType[];
  constructor(
    private plan: { name: string }[],
    private userDataDraft: IAdminPlanType[]
  ) {
    this.planData =
      plan?.map((el) => {
        return { name: el.name };
      }) || [];
    this.userData =
      userDataDraft?.map((el, index) => {
        return {
          no: index + 1,
          username: el.username,
          MatchCountRemaining: el.MatchCountRemaining,
          expiry: new Date(el.expiry).toDateString(),
          planAmount: el.planAmount,
          planName: el.planName,
        };
      }) || [];
  }
}
