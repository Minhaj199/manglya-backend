import mongoose from "mongoose";

const mongo_string: string | undefined = process.env.CONNECTIN_STRING;

export const connectMongdb=async()=>{
    if(!mongo_string){
        console.log('server closed Due to DB error')
        process.exit(1)

    }
    try {
     await mongoose
        .connect(mongo_string||'')
        console.log('DB connected')
        
    } catch  {
      console.log('DB Disconnectd')
      process.exit(1)
    }
}