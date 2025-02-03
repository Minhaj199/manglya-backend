var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { io } from "./server.js";
import { socketIdMap } from "./server.js";
export const socketMethod = (socket, partnerService, userProfileService, messageService, jwtService, authService) => {
    socket.on('register_user', (data) => {
        try {
            if (data.userId) {
                const userId = jwtService.decodeAccessToken(data.userId);
                if (userId) {
                    socketIdMap.set(userId, socket.id);
                    io.emit('newUserOnline', { id: userId });
                }
                else {
                    throw new Error('user id not found');
                }
            }
            else {
                throw new Error('user id not found');
            }
        }
        catch (error) {
            io.to(socket.id).emit('errorFromSocket', { message: error.message || 'error on user registration' });
        }
    });
    socket.on('request_send', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const senderId = jwtService.decodeAccessToken(data.sender);
            if (!senderId) {
                throw new Error('error on request sending');
            }
            io.to(socketIdMap.get(data.reciever) || '').emit('new_connect', {
                data: yield partnerService.createRequeset(senderId),
                note: 'you have a request'
            });
        }
        catch (error) {
            io.to(socket.id).emit('errorFromSocket', { message: error.message || 'error on user registration' });
            console.log(error);
        }
    }));
    socket.on('userLoggedOut', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = jwtService.decodeRefreshToken(data.token);
            if (!id || typeof id !== 'string') {
                throw new Error('id not found');
            }
            yield authService.userLoggedOut(id, data.token);
            socketIdMap.delete(id);
            socket.broadcast.emit('user_loggedOut', { id: id });
        }
        catch (error) {
            io.to(socket.id).emit('errorFromSocket', { message: error.message || 'error on user registration' });
            console.log(error);
        }
    }));
    socket.on('userRequestSocket', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const requesterSocket = socketIdMap.get(data.partnerId);
            const accptor = jwtService.decodeAccessToken(data.token);
            if (!accptor) {
                throw new Error('id not foudn');
            }
            const getName = yield userProfileService.fetchName(accptor);
            io.to(requesterSocket || '').emit('requestStutus', {
                name: getName,
                from: data.from
            });
        }
        catch (error) {
            io.to(socket.id).emit('errorFromSocket', { message: error.message || 'error on user registration' });
        }
    }));
    socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const receiver = socketIdMap.get(data.receiverId);
            const senderId = jwtService.verifyRefreshToken(data.senderId, 'user');
            if (receiver && senderId) {
                const recieverName = yield userProfileService.fetchName(senderId);
                io.to(receiver || '').emit('recieveMessage', data);
                io.to(receiver || '').emit('addMessageCount', {
                    id: senderId,
                    name: recieverName
                });
            }
        }
        catch (error) {
            io.to(socket.id).emit('errorFromSocket', { message: error.message || 'error on user registration' });
            console.log(error);
        }
    }));
    socket.on('makeReaded', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield messageService.updateReadedMessage(data.chatId);
        }
        catch (error) {
            console.log(error);
            io.to(socket.id).emit('errorFromSocket', { message: error.message || 'error on user make readed' });
        }
    }));
    socket.on('userJoined', (data) => {
        try {
            if (socketIdMap.has(data.reciverId)) {
                const senderId = jwtService.decodeAccessToken(data.senderId);
                if (socketIdMap.has(senderId)) {
                    io.to(socketIdMap.get(senderId || '') || '').emit('userIsOnline', { onlineStatus: true });
                    io.to(socketIdMap.get(data.reciverId) || '').emit('userIsOnline', { onlineStatus: true });
                }
            }
        }
        catch (error) {
            io.to(socket.id).emit('errorFromSocket', { message: error.message || 'error on user registration' });
            console.log(error);
        }
    });
};
