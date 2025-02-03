import bcrypt from 'bcryptjs'
import { BcryptAdapterInterface } from '../types/serviceLayerInterfaces.js' 


export class BcryptAdapter implements BcryptAdapterInterface{
    async hash(password:string):Promise<string>{
        try {
            return await bcrypt.hash(password,10)
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
    async compare(password:string,hashed:string):Promise<boolean>{
        try {
            return await bcrypt.compare(password,hashed)
        } catch (error:any) {
            throw new Error(error.message||'erron on message')
        }
    }
}