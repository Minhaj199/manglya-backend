import { Socket } from "socket.io";
import { io } from "./server";
import { socketIdMap } from "./server";
import { PartnerProfileService } from "./services/implimentaion/partnersProfileService";
import { UserProfileService } from "./services/implimentaion/userProfileService";
import { MessageService } from "./services/implimentaion/messageService";
import { JWTAdapter } from "./utils/jwtAdapter";
import { AuthService } from "./services/implimentaion/userAuthService";
import { ResponseMessage } from "./constrain/ResponseMessageContrain";

export const socketMethod = (
  socket: Socket,
  partnerService: PartnerProfileService,
  userProfileService: UserProfileService,
  messageService: MessageService,
  jwtService: JWTAdapter,
  authService: AuthService
) => {
  socket.on("register_user", (data: { userId: string }) => {
    try {
      if (data.userId) {
        const userId = jwtService.decodeAccessToken(data.userId);
        if (userId) {
          socketIdMap.set(userId, socket.id);
          io.emit("newUserOnline", { id: userId });
        } else {
          throw new Error(ResponseMessage.ID_NOT_FOUND);
        }
      } else {
        throw new Error(ResponseMessage.ID_NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof Error) {
        io.to(socket.id).emit("errorFromSocket", {
          message: error.message || "error on user registration",
        });
      } else {
        io.to(socket.id).emit("errorFromSocket", {
          message: "error on user registration",
        });
      }
    }
  });
  socket.on(
    "request_send",
    async (data: { sender: string; reciever: string }) => {
      try {
        const senderId = jwtService.decodeAccessToken(data.sender);
        if (!senderId) {
          throw new Error("error on request sending");
        }
        io.to(socketIdMap.get(data.reciever) || "").emit("new_connect", {
          data: await partnerService.createRequeset(senderId),
          note: "you have a request",
        });
      } catch (error) {
        if (error instanceof Error) {
          io.to(socket.id).emit("errorFromSocket", {
            message: error.message || "error on user registration",
          });
        } else {
          io.to(socket.id).emit("errorFromSocket", {
            message: "error on user registration",
          });
        }
      }
    }
  );
  socket.on("userLoggedOut", async (data: { token: string }) => {
    try {
      const id = jwtService.decodeRefreshToken(data.token);

      if (!id || typeof id !== "string") {
        throw new Error(ResponseMessage.ID_NOT_FOUND);
      }
      await authService.userLoggedOut(id, data.token);
      socketIdMap.delete(id);
      socket.broadcast.emit("user_loggedOut", { id: id });
    } catch (error) {
      if (error instanceof Error) {
        io.to(socket.id).emit("errorFromSocket", {
          message: error.message || "error on user registration",
        });
      } else {
        io.to(socket.id).emit("errorFromSocket", {
          message: "error on user registration",
        });
      }
    }
  });
  socket.on(
    "userRequestSocket",
    async (data: {
      partnerId: string;
      from: "accept" | "reject";
      token: string;
    }) => {
      try {
        const requesterSocket = socketIdMap.get(data.partnerId);
        const accptor = jwtService.decodeAccessToken(data.token);
        if (!accptor) {
          throw new Error(ResponseMessage.ID_NOT_FOUND);
        }
        const getName = await userProfileService.fetchName(accptor);
        io.to(requesterSocket || "").emit("requestStutus", {
          name: getName,
          from: data.from,
        });
      } catch (error) {
        if (error instanceof Error) {
          io.to(socket.id).emit("errorFromSocket", {
            message: error.message || "error on user registration",
          });
        } else {
          io.to(socket.id).emit("errorFromSocket", {
            message: "error on user registration",
          });
        }
      }
    }
  );
  socket.on(
    "sendMessage",
    async (data: {
      receiverId: string;
      senderId: string;
      text: string;
      createdAt: Date;
      _id: string;
      chatId: string;
    }) => {
      try {
        const receiver = socketIdMap.get(data.receiverId);
        const senderId = jwtService.verifyRefreshToken(data.senderId, "user");
        console.log(senderId)
        if (receiver && senderId&&typeof senderId==='string') {
          const recieverName = await userProfileService.fetchName(senderId);

          io.to(receiver || "").emit("recieveMessage", data);
          io.to(receiver || "").emit("addMessageCount", {
            id: senderId,
            name: recieverName,
          });
        }
      } catch {
        io.to(socket.id).emit("errorFromSocket", {
          message: "error on user registration",
        });
      }
    }
  );
  socket.on("makeReaded", async (data) => {
    try {
      await messageService.updateReadedMessage(data.chatId);
    } catch {
      io.to(socket.id).emit("errorFromSocket", {
        message: "error on user make readed",
      });
    }
  });
  socket.on("userJoined", (data) => {
    try {
      if (socketIdMap.has(data.reciverId)) {
        const senderId = jwtService.decodeAccessToken(data.senderId);
        if (socketIdMap.has(senderId)) {
          io.to(socketIdMap.get(senderId || "") || "").emit("userIsOnline", {
            onlineStatus: true,
          });
          io.to(socketIdMap.get(data.reciverId) || "").emit("userIsOnline", {
            onlineStatus: true,
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        io.to(socket.id).emit("errorFromSocket", {
          message: error.message || "error on user registration",
        });
      } else {
        io.to(socket.id).emit("errorFromSocket", {
          message: "error on user registration",
        });
      }
    }
  });
};
