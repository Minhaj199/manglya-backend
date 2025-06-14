import {z} from 'zod'

export const firstBatchDataDto=z.object({
    "FIRST NAME":z.string().min(3).max(10),
    'SECOND NAME':z.string().min(1).max(10),
      'DATE OF BIRTH':z.string().min(3),
      'DISTRICT THAT YOU LIVE':z.string().min(3),
      'YOUR GENDER':z.string(),
      'GENDER OF PARTNER':z.string().min(3),
      'EMAIL':z.string().email(),
      'PASSWORD':z.string().min(3), 
})