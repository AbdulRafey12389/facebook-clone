const User = require("../models/userModel");
const Bio = require("../models/UserBioModel");
const response = require("../utils/responseHandler");
const { uploadFileToCloudinary } = require("../config/cloudinary");



const createOrUpdateUserBio = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(userId);
    
    const {
      bioText,
      liveIn,
      relationShip,
      workplace,
      hometown,
      education,
      phone,
    } = req.body;

    let bio = await Bio.findOneAndUpdate(
      { user: userId },
      {
        bioText,
        liveIn,
        relationShip,
        workplace,
        hometown,
        education,
        phone,
      },
      { new: true, runValidators: true }
    );
    

    if (!bio) {
      bio = new Bio({
        user: userId,
        bioText,
        liveIn,
        relationship,
        workplace,
        hometown,
        education,
        phone,
      });

      await bio.save();
      await User.findByIdAndUpdate(userId, {bio: bio._id});
    }


    return response(res, 201, "Bio created and updated successfully!", bio);




  } catch (error) {

    console.error("Error creating and updating bio: ", error.message);
    return response(res, 500, "Internal server error", error.message);

  }

};



const updateCoverPhoto = async (req, res) => {
  try {
    
    const { userId } = req.params;
    let coverPhoto = null;

    console.log(userId);
    

    if (req.file) {
      const uploadResult = await uploadFileToCloudinary(req.file);
      coverPhoto = uploadResult.secure_url;
    }

    if (!coverPhoto) return response(res, 400, "Faild to upload cover photo!!!")

    await User.updateOne({ _id: userId }, {
      $set: {
        coverPhoto
      }
    });


    const updateUser = await User.findById(userId).select("coverPhoto");


    return response(res, 200, "coverPhoto update and upload successfuly!", updateUser);

  } catch (error) {

    console.error("Error updating cover photo error: ", error.message);
    return response(res, 500, "Internal server error", error.message);

  }
};


const updateUserProfile = async (req, res) => {
  try {
    
    const { userId } = req.params;
    const { username, gender, dateOfBirth } = req.body;
    let profilePicture = null;

    if (req.file) {
      const uploadResult = await uploadFileToCloudinary(req.file);
      profilePicture = uploadResult.secure_url;

      if (!profilePicture) return response(res, 400, "Faild to upload profile picture!!!")
    }


    await User.updateOne({ _id: userId }, {
      $set: {
        username,
        gender,
        dateOfBirth,
        ...( profilePicture && { profilePicture } )
      }
    });


    const updateUser = await User.findById(userId);

    if (!updateUser) return response(res, 404, "User not found with this id!!!");



    return response(res, 200, "User profile update successfuly!", updateUser);

  } catch (error) {
    console.error("Error to updating profile: ", error.message);
    return response(res, 500, "Internal server error", error.message);
  }
};





module.exports = {
    createOrUpdateUserBio,
    updateCoverPhoto,
    updateUserProfile
};
