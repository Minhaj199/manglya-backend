import { IUserRepository } from "../../repository/interface/IUserRepository.ts"
import { ICronServiceInterface } from "../interfaces/ICroneSevice.ts" 


export class CronService implements ICronServiceInterface{
    private userRepo:IUserRepository
    constructor (userRepo:IUserRepository){
        this.userRepo=userRepo
    }
    async checkExpiration(){
        try {
            await this.userRepo.makePlanExpire()
        } catch (error) {
         console.log(error)   
        }
    }
}