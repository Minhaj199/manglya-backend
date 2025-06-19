import { array, boolean, number, string, z } from "zod";

export const adminLoginValidatoSchema= z.object({
  email: string({ required_error: "email" }).email("Not valid user name"),
  password: string({ required_error: "passoword" }).min(
    1,
    "Not a valid passoword"
  ),
});
export const blockAndUnblockValidatorSchema= z.object({
  updateStatus: boolean(),
});
export const addPlanValidatorSchma= z.object({
  datas: z.object({
    name: z
      .string({ required_error: "name required" })
      .min(2, "Enter a valid name "),
    amount: z
      .number({ required_error: "amount required" })
      .min(1, "enter a valid amount")
      .max(1000000, "enter a small amount"),
    connect: number({ required_error: "connect required" }).min(
      1,
      "enter a valid connect"
    ),
    duration: number({ required_error: "duration required" }).min(
      1,
      "enter valid duration"
    ),
  }),
  handleFeatureState: array(z.string().min(1, "atleast 1 feature")),
});
export const editPlanDtoShema = z.object({
  name: z.string().min(2, "Enter a valid name ").optional(),
  amount: z
    .number()
    .min(1, "enter a valid amount")
    .max(1000000, "enter a small amount")
    .optional(),
  connect: number().min(1, "enter a valid connect").optional(),
  duration: number().min(1, "enter valid duration").optional(),
  features: array(z.string().min(1, "atleast 1 feature")).optional(),
});
export const reportAbuseActionValidatorSchema= z.object({
  reporter: z
    .string({ required_error: "reporter id required" })
    .min(2, "missing a valid reporter id"),
  reported: z
    .string({ required_error: "reported id required" })
    .min(2, "missing a valid reported id"),
});
export const reportAbuseRejectShema = z.object({
  reporter: z
    .string({ required_error: "reporter id required" })
    .min(2, "missing a valid reporter id"),
});
export const abuseMessageToggleShema = z.object({
  status: z.boolean({ required_error: "boolean value required" }),
});
