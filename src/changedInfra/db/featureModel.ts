import mongoose,{Schema,Document} from "mongoose";


export interface Features extends Document{
    features:string[]
}

const featureFeatures=new Schema<Features>({
    features:[String]
})

export const featureModel=mongoose.model<Features>('feature',featureFeatures)