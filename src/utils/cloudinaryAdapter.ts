import cloudinary from "../config/cloundinaryConfig";
import { unlink } from "fs";
import { ICloudinaryAdapter } from "../types/TypesAndInterfaces";

export class Cloudinary implements ICloudinaryAdapter {
  async upload(path: string): Promise<string> {
    try {
      const result = await cloudinary.v2.uploader.upload(path, {
        folder: "mangalya",
      });

      unlink(path, () => {});
      if (result.secure_url) {
        return result.secure_url;
      } else {
        throw new Error("error on image uploading");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("unexptected error");
      }
    }
  }
}
