import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRoutes from "./interface/routes/adminRoute.ts";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketMethod } from "./socket.ts";
import { JWTAdapter } from "./infrastructure/jwt.ts";
import { FixedDataService } from "./application/services/InterestAndFeatures.ts";
import {
  InterestRepo,
  TokenRepository,
} from "./infrastructure/repositories/otherRepo.ts";
import { FeaturesRepository } from "./infrastructure/repositories/otherRepo.ts";
import userRoutes, { authService, messageService, partnerServiece, userProfileService } from './interface/routes/userRoutes'
import cookieParser from "cookie-parser";
const app = express();
const server = createServer(app);
import { job } from "./interface/utility/chronJob.ts";
import { AuthService } from "./application/services/authService.ts";
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
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOpetion));

///////logger/////////////

app.use(morgan("tiny"));

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

const mongo_string: string | undefined = process.env.CONNECTIN_STRING;

try {
  mongoose
    .connect(typeof mongo_string === "string" ? mongo_string : " ")
    .then(() => console.log("db connected"));
} catch (error) {
  console.log(error);
}

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
  } catch (error) {}
}
job.start();
createInterest();
