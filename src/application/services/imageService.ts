import { Cloudinary } from '../../interface/utility/cloudinary.js'; 
import { ImageServiceInterface } from '../../types/TypesAndInterfaces.js';


export class ImageService implements ImageServiceInterface{
    private imageService:Cloudinary
    constructor(imageService:Cloudinary){
        this.imageService=imageService
    }
     upload(path:string){
       return this.imageService.upload(path)
    }
}



