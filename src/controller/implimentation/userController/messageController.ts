import { NextFunction, Request, Response } from "express";
import { IChatService } from "../../../services/interfaces/IChatService";
import { ResponseMessage } from "../../../constrain/ResponseMessageContrain";
import { IMessageService } from "../../../services/interfaces/IMessageSerivice";
import { IMessageController } from "../../interface/IUserController";



export class MessageController implements IMessageController{
    constructor( private readonly chatRoomService: IChatService,
        private readonly messageService: IMessageService,
       ){

    }
getChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new Error(ResponseMessage.ID_NOT_FOUND);
      }
      const response = await this.chatRoomService.fetchChats(
        id,
        req.userID
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  getMessages = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
  
        if (!id) {
          throw new Error(ResponseMessage.ID_NOT_FOUND);
        }
        const response = await this.messageService.findAllMessage(id);
        res.json(response);
      } catch (error) {
        next(error);
      }
    };
    getUserForChat = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        if (!id) {
          throw new Error(ResponseMessage.ID_NOT_FOUND);
        }
        const response = await this.chatRoomService.fetchUserForChat(id);
       
        res.json(response);
      } catch (error) {
        next(error);
      }
    };
    MsgCount = async (req: Request, res: Response) => {
      try {
        const response = await this.messageService.messageCount(
          req.userID,
          req.query.from
        );
        res.json(response);
      } catch {
        res.json({ count: 0 });
      }
    };
    MessageViewed = async (req: Request, res: Response) => {
      try {
        const response = await this.messageService.makeAllUsersMessageReaded(
          req.body.from,
          req.body.ids
        );
        res.json({ status: response });
      } catch {
        res.json({ status: false });
      }
    };
    saveImage = async (req: Request, res: Response) => {
      try {
        if (req.file && typeof req.file.path === "string") {
          const getImgUrl = await this.messageService.createImageUrl(
            req.file.path
          );
          res.json({ image: getImgUrl });
        } else {
          throw new Error(ResponseMessage.SERVER_ERROR);
        }
      } catch {
        res.json({ status: false });
      }
    };
     createTexts = async (req: Request, res: Response, next: NextFunction) => {
        try {
          if (req.body.chatId === "") {
            throw new Error(ResponseMessage.ID_NOT_FOUND);
          }
    
          const response = await this.chatRoomService.createMessage(
            req.body.chatId,
            req.body.senderIdString,
            req.body.receiverId,
            req.body.text,
            req.body.image
          );
          res.json({ newMessage: response });
        } catch (error) {
          next(error);
        }
      };
}