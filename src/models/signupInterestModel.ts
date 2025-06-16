import mongoose, { Schema } from "mongoose";
import { IInterestInterface } from "../types/TypesAndInterfaces";

const interestSchem = new Schema<IInterestInterface>({
  sports: { type: [String], required: true },
  music: { type: [String], required: true },
  food: { type: [String], required: true },
});

export const InterestModel = mongoose.model<IInterestInterface>(
  "Interests",
  interestSchem
);
