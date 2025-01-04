const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  followUser,
  unFollowUser,
  deleteUserFromRequest,
  getAllFreindRequest,
  getAllUserForRequest,
  getAllMutualFriends,
  getAllUser,
  checkUserAuth,
  getUserProfile,
} = require("../controllers/userController");

const { createOrUpdateUserBio, updateCoverPhoto, updateUserProfile } = require("../controllers/createOrUpdateController");
const { multerMiddleware } = require("../config/cloudinary");

const router = Router();



router.get("/", authMiddleware, getAllUser);

router.post("/follow", authMiddleware, followUser);

router.post("/unfollow", authMiddleware, unFollowUser);

router.post("/friend-request/remove", authMiddleware, deleteUserFromRequest);

router.get("/friend-request", authMiddleware, getAllFreindRequest);

router.get("/user-to-request", authMiddleware, getAllUserForRequest);

router.get("/mutual-friends/:userId", authMiddleware, getAllMutualFriends);

router.get("/check-auth", authMiddleware, checkUserAuth);

router.get("/profile/:userId", authMiddleware, getUserProfile);

router.put("/bio/:userId", authMiddleware, createOrUpdateUserBio);

router.put("/profile/cover-photo/:userId", authMiddleware, multerMiddleware.single("coverPhoto"), updateCoverPhoto);

router.put("/profile/:userId", authMiddleware, multerMiddleware.single('profilePicture'), updateUserProfile);



module.exports = router;
