import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET_KEY 
    });

const uploadOnCloudinary= async (localFilePath)=> {
    try {
        if(!localFilePath) return null;
        const response= await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto",
        })
        console.log("Your file has been successfully uploaded ",localFilePath);
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath) // removes the file that is stored locally and was intended to be stored on cloud
        return null;
    }
}
export {uploadOnCloudinary};