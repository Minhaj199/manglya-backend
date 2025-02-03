import { UserRepository } from "../../domain/interface/userRepositoryInterface.js"
import { CronServiceInterface } from "../../types/serviceLayerInterfaces.js"


export class CroneService implements CronServiceInterface{
    private userRepo:UserRepository
    constructor (userRepo:UserRepository){
        this.userRepo=userRepo
    }
    async checkExperation(){
        try {
            await this.userRepo.makePlanExpire()
        } catch (error) {
         console.log(error)   
        }
    }
}