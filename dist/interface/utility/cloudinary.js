var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cloudinary from 'cloudinary';
import dotEnv from 'dotenv';
dotEnv.config();
import fs from 'fs';
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
export class Cloudinary {
    upload(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield cloudinary.v2.uploader.upload(path, {
                    folder: 'mangalya'
                });
                fs.unlink(path, () => { });
                if (result.secure_url) {
                    return result.secure_url;
                }
                else {
                    throw new Error('error on image uploading');
                }
            }
            catch (error) {
                console.log(error);
                throw new Error(error.message || 'error on cloudinary');
            }
        });
    }
}
