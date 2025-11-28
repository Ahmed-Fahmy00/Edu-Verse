// utils/cloudinary.js
// Cloudinary integration is commented out for now.
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import dotenv from "dotenv";
//
// dotenv.config();
//
// //Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
//
// //Create Cloudinary storage instance for Multer
// const communityStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
//     public_id: (req, file) => `community_${req.body.name}`,
//   },
// });
//
// export { cloudinary, communityStorage };
