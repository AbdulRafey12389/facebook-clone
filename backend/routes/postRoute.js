const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { multerMiddleware } = require("../config/cloudinary");
const {
  createPost,
  getAllPost,
  getPostByUserId,
  likePost,
  sharePost,
  addCommentToPost,
  getAllStory,
  createStory,
  deletePost,
  deleteStory,
} = require("../controllers/postController");

const router = Router();

router.post(
  "/post",
  authMiddleware,
  multerMiddleware.single("media"),
  createPost
);

router.get("/posts", authMiddleware, getAllPost);

router.get("/posts/user/:userId", authMiddleware, getPostByUserId);

router.post("/posts/delete/:userId", authMiddleware, deletePost);

router.post("/posts/likes/:postId", authMiddleware, likePost);

router.post("/posts/shares/:postId", authMiddleware, sharePost);

router.post("/posts/comments/:postId", authMiddleware, addCommentToPost);

router.post("/story", authMiddleware, multerMiddleware.single("media"), createStory);

router.post("/story/delete/:storyId", authMiddleware, deleteStory);

router.get("/story", authMiddleware, getAllStory);


module.exports = router;
