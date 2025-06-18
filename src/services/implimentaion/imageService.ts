import { ICloudinaryAdapter } from "../../types/TypesAndInterfaces";
import { IImageServiceInterface } from "../interfaces/IImageService";

export class ImageService implements IImageServiceInterface {
  private imageService: ICloudinaryAdapter;
  constructor(imageService: ICloudinaryAdapter) {
    this.imageService = imageService;
  }
  upload(path: string) {
    return this.imageService.upload(path);
  }
}
