import {
  IFeaturesRepository,
  IOtherRepositories,
} from "../../repository/interface/IOtherRepositories";
import { IFixedDataService } from "../interfaces/IInterstAndFeatureSerivice";

export class FixedDataService implements IFixedDataService {
  private interestRepo: IOtherRepositories;
  private featureRepo: IFeaturesRepository;

  constructor(
    interestRepo: IOtherRepositories,
    featureRepo: IFeaturesRepository
  ) {
    this.interestRepo = interestRepo;
    this.featureRepo = featureRepo;
  }

  async creatInterest() {
    const interestData = {
      sports: ["Football", "Cricket", "Hockey"],
      music: ["Hollywood", "Bollywood", "Molywood"],
      food: ["Biryani", "Sadya"],
    };
    try {
      const isExist = await this.interestRepo.isExist();
      if (!isExist) {
        await this.interestRepo.create(interestData);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async createFeatures() {
    const features = ["Unlimited message", "Suggestion", "Priority"];
    try {
      const isExist = await this.featureRepo.isExits();
      if (!isExist) {
        await this.featureRepo.create({ features });
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchFeature() {
    try {
      const result = await this.featureRepo.fetchFeature();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
  async fetchInterestAsCategory() {
    try {
      const data = await this.interestRepo.fetchInterestAsCategory();
      if (data) {
        return data;
      } else {
        throw new Error("interest not found");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
}
