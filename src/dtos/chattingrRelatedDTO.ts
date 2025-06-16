import { IMessageDTO, IParternDataChatList } from "../types/dtoTypesAndInterfaces";
import { IExtentedMatchProfile, IMessageOuput, IMessageRow } from "../types/TypesAndInterfaces";

/////////////////chatting page listing user/////////////
export class ParternDataChatList implements IParternDataChatList {
    connectedParterns:Omit<IExtentedMatchProfile,'lastName'>[]|[];
    Places:string[]
    onlines:string[]
    constructor(private rowParternData:Omit<IExtentedMatchProfile,'lastName'>[],private rowPlaces:string[],private rowOnliners:string[]){
        this.connectedParterns=this.rowParternData.map((elem)=>{
            return{
                 _id: elem._id,
                state: elem.state,
                 photo: elem.photo,
            dateOfBirth: elem.dateOfBirth,
            firstName: elem.firstName,
            age:elem.age,
            }
        })||[]
        this.Places=this.rowPlaces||[]
        this.onlines=this.rowOnliners||[]
    }
} 
//////////////////sending created message after creation///////////////
export class MessageDTO implements IMessageDTO{
    message:IMessageOuput
    constructor(private rowMessage:IMessageRow){
        this.message={
             chatRoomId: this.rowMessage.chatRoomId,
              senderId: this.rowMessage.senderId,
              receiverId: this.rowMessage.receiverId,
              text: this.rowMessage.text,
              viewedOnNav: this.rowMessage.viewedOnNav,
              viewedList: this.rowMessage.viewedList,
              image: this.rowMessage.image,
              createdAt: this.rowMessage.createdAt
        }
    }
}

