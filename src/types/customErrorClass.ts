export class AppError extends Error{
    constructor(message:string,public statusCode:number=500,){
        super(message)
        this.statusCode=statusCode
        Object.setPrototypeOf(this,AppError.prototype)
        Error.captureStackTrace(this,this.constructor)
    }
}