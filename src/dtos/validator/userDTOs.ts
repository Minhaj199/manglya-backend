import {z} from 'zod'

export const firstBatchDataDto=z.object({
    "FIRST NAME":z.string({ required_error: "first name required" }).min(3,'first name shoud be more thant 3').max(10,'first name shoud be less than 10'),
    'SECOND NAME':z.string({ required_error: "second name required" }).min(1,'second name shoud be more thant ').max(10,'first name shoud be less thant 10'),
      'DATE OF BIRTH':z.string({ required_error: "date of birth required" }).min(3,'not valid data of birth'),
      'DISTRICT THAT YOU LIVE':z.string({ required_error: "district name required" }).min(2,'not valid district'),
      'YOUR GENDER':z.string({ required_error: "your gender required" }).min(2,'not valid gender'),
      'GENDER OF PARTNER':z.string({ required_error: "partner gender required" }).min(3,'not valid partner gender'),
      'EMAIL':z.string({ required_error: "email required" }).email('not a valid email'),
      'PASSWORD':z.string({ required_error: "passoword required" }).min(3,'not valid passwordz'), 
})