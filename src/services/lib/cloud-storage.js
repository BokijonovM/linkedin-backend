import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

export const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    // folder: process.env.CLOUD_FOLDER,
    folder: process.env.CLOUDINARY_URL,
  },
});

export default cloudStorage;
