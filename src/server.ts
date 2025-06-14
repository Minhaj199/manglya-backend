import express from "express";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoute.ts";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketMethod } from "./socket.ts";
import { JWTAdapter } from "./utils/jwtAdapter.ts";
import { FixedDataService } from "./services/implimentaion/InterestAndFeaturesService.ts";
import fs from 'fs'
import userRoutes, { authService, messageService, partnerServiece, userProfileService } from './routes/userRoutes.ts'
import cookieParser from "cookie-parser";
const app = express();
const server = createServer(app);
import { job } from "./utils/cronJobAdapter.ts";
import { globalErrorHandler } from "./middlewares/errorHandlerMiddleware.ts";
import { connectMongdb } from "./config/mongodbConfig.ts";
import { FeaturesRepository, InterestRepo, TokenRepository } from "./repository/implimention/otherRepository.ts";

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["authorizationforuser"],
  },
});
const corsOpetion = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  exposedHeaders: ["authorizationforuser"],
};

dotenv.config();

  
  connectMongdb()

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOpetion));

///////logger/////////////

app.use(morgan("tiny"));

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);



// Real-time Socket.IO Integration

export const socketIdMap = new Map<string, string>();

const jwtService = new JWTAdapter(new TokenRepository());
io.on("connection", (socket) =>
  socketMethod(
    socket,
    partnerServiece,
    userProfileService,
    messageService,
    jwtService,
    authService
  )
);

const PORT: number = parseInt(process.env.PORT || "3000");
server.listen(PORT, () => console.log(`server is running now ${PORT}`));

const otherService = new FixedDataService(
  new InterestRepo(),
  new FeaturesRepository()
);

async function createInterest() {
  try {
    await otherService.creatInterest();
    await otherService.createFeatures();
  } catch (error) {
    if(error instanceof Error){
      fs.writeFile('./src/logger/errorLog.log',error.message,()=>{})
    }
  }
}

job.start();
createInterest();



///////////////////////////global error handler ////////////////////////

app.use(globalErrorHandler)
