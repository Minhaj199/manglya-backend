import { IFeatures } from "../../types/TypesAndInterfaces";


export interface  IFixedDataService {
  creatInterest(): Promise<void>;
  createFeatures(): Promise<void>;
  fetchFeature(): Promise<{
    features: IFeatures;
  } | null>;
  fetchInterestAsCategory(): Promise<
    { sports: string[]; music: string[]; food: string[] } | undefined
  >;
}
export interface PhotoServiceInterface {
  upload(path: string): string;
}