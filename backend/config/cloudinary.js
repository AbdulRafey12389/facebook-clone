const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;



cloudinary.config({
    cloud_name: process.env.CLOUUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadFileToCloudinary = (file) => {

    const option = {
        resource_type: file.mimetype.startsWith("video") ? "video" : "image"
    }

    return new Promise((resolve, reject) => {
        // VIDEO AND IMAGES UPLOAD CONDITION...
        if (file.mimetype.startsWith("video")) {
            
            cloudinary.uploader.upload_large(file.path, option, (error, result) => {
    
                if (error) {
                    return reject(error)
                }

                resolve(result)
    
            } )
    
        } else {
            
            cloudinary.uploader.upload(file.path, option, (error, result) => {
    
                if (error) {
                    return reject(error)
                }

                resolve(result)
    
            } )

        }

    });

};


const deleteFileFromCloudinary = async (publicId, type) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: type
      });

      return result;
    } catch (error) {
      console.error('Error deleting file:', error);
      return error.message;
    }
  };


const multerMiddleware = multer({dest: "uploads/"});


module.exports = {
    multerMiddleware,
    uploadFileToCloudinary,
    deleteFileFromCloudinary
}