var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes, { authService, messageService, partnerServiece, userProfileService } from './interface/routes/userRoutes.js';
import adminRoutes from './interface/routes/adminRoute.js';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketMethod } from './socket.js';
import { JWTAdapter } from './Infrastructure/jwt.js';
import { FixedDataService } from './application/services/InterestAndFeatures.js';
import { InterestRepo, TokenRepository } from './Infrastructure/repositories/otherRepo.js';
import { FeaturesRepository } from './Infrastructure/repositories/otherRepo.js';
import cookieParser from 'cookie-parser';
const app = express();
const server = createServer(app);
import { job } from './Infrastructure/chronJob.js';
export const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        exposedHeaders: ['authorizationforuser'],
    }
});
const corsOpetion = {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    exposedHeaders: ['authorizationforuser'],
};
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOpetion));
///////logger/////////////
// const __filename=fileURLToPath(import.meta.url)
// const __dirname=dirname(__filename)
// const accessLogStream=createWriteStream(join(__dirname, '/logger/morganLogs.log'),{ flags: 'a' })
app.use(morgan('tiny'));
// app.use(morgan('combined',{stream:accessLogStream }))
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
const mongo_string = process.env.CONNECTIN_STRING;
try {
    mongoose.connect((typeof mongo_string === 'string') ? mongo_string : ' ').then(() => console.log('db connected'));
}
catch (error) {
    console.log(error);
}
// Real-time Socket.IO Integration
export const socketIdMap = new Map();
const jwtService = new JWTAdapter(new TokenRepository);
io.on('connection', (socket) => socketMethod(socket, partnerServiece, userProfileService, messageService, jwtService, authService));
const PORT = parseInt(process.env.PORT || '3000');
server.listen(PORT, () => console.log(`server is running now ${PORT}`));
const otherService = new FixedDataService(new InterestRepo, new FeaturesRepository);
function createInterest() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield otherService.creatInterest();
            yield otherService.createFeatures();
        }
        catch (error) {
        }
    });
}
job.start();
createInterest();
