export interface IImageServiceInterface{
    upload(path:string):Promise<string>
}