require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"blog-app",
        allowedFormats: ['jpg','jpeg','png'],
        transformation:[
            {
                width: 500,
                height: 500,
                crop: "limit"
            }
        ],
        fetch_format:"auto"
    }
});


module.exports = storage;
