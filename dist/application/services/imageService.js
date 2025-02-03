export class ImageService {
    constructor(imageService) {
        this.imageService = imageService;
    }
    upload(path) {
        return this.imageService.upload(path);
    }
}
