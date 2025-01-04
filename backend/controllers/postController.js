const { uploadFileToCloudinary, deleteFileFromCloudinary } = require("../config/cloudinary");
const Post = require("../models/postModel");
const Story = require("../models/StoryModel");
const response = require("../utils/responseHandler");



const createPost = async (req, res) => {
    try {
        
        const { userId } = req.user;

        const { content } = req.body;

        let mediaUrl = null;
        let mediaType = null;
        let publicId = null;

        if (req.file) {
            const uploadResult = await uploadFileToCloudinary(req.file);
            
            mediaUrl = uploadResult.secure_url;
            mediaType = req.file.mimetype.startsWith("video") ? "video" : "image"
            publicId = uploadResult.public_id;
            
            
        }

        // CREATE USER POST...
        const newPost = await new Post({
            user: userId,
            content,
            mediaUrl,
            mediaType,
            publicId
        })

        await newPost.save();

        return response(res, 201, "Post Created Successfully!", newPost);
         

    } catch (error) {

        console.error("Error Creating a Post: ", error.message);
        response(res, 500, "Internal server error", error.message);
        
    }
    
};


const getAllPost = async (req, res) => {
    try {
        
        const posts = await Post.find().sort({createdAt: -1}).populate("user", "_id username profilePicture email").populate({
            path: "comments.user",
            select: "username profilePicture"
        })


        return response(res, 201, "Get all posts successfully!", posts)


    } catch (error) {
        
        console.error("Error getting all posts: ", error.message);
        return response(res, 500, "Internal server error", error.message);
        

    }
};


const getPostByUserId = async (req, res) => {
    try {
        
        const { userId } = req.params;

        if (!userId) {
            return response(res, 400, "User id required to get user posts!!!")
        }


        const posts = await Post.find({ user: userId }).sort({createdAt: -1}).populate("user", "_id username profilePicture email").populate({
            path: "comments.user",
            select: "username, profilePicture"
        });
        


        return response(res, 201, "Get all user post successfully!", posts)

 
    } catch (error) {

        console.error("Error getting all posts: ", error.message);
        return response(res, 500, "Internal server error", error.message);

    }
};

const deletePost = async (req, res) => {
    try {
        const { userId } = req.params;
        const { publicId,  mediaType } = req.body;
        

        if (!userId) return response(res, 404, "Post not found");

        if (publicId) {
            await deleteFileFromCloudinary(publicId, mediaType);
        }
        

        await Post.findByIdAndDelete(userId);



        return response(res, 200, "post sucessFully! Deleted");


    } catch (error) {

        console.log(error);
        return response(res, 501, "Internal server error", error.message)
        
    }

};


const likePost = async (req, res) => {
    try {
        
        const { postId } = req.params;
        const { userId } = req.user;

        const post = await Post.findById(postId);

        if(!post) return response(res, 401, "Please make sure post id id correct!!!");

        const hasLiked = post.likes.includes(userId);

        if(hasLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
            post.likeCount = Math.max(0, post.likeCount - 1);
        }else {
            post.likes.push(userId);
            post.likeCount += 1;
        }

        const updatedPost = await post.save();

        return response(res, 201, hasLiked ? "Post unliked successfully!" : "Post liked successfully!", updatedPost)

    } catch (error) {
        
        console.error("Error in liking: ", error.message);
        return response(res, 500, "Internal server error", error.message);

    }
};


const sharePost = async (req, res) => {
    try {
        
        const { postId } = req.params;
        const { userId } = req.user;
        

        const post = await Post.findById(postId);

        if(!post) return response(res, 401, "Please make sure post id id correct!!!");

        const hasUserShared = post.shares.includes(userId);

        if(!hasUserShared) {
            post.shares.push(userId);
        }

        post.shareCount += 1;

        await post.save();

        return response(res, 201, "Post shared by you", post)

    } catch (error) {
        
        console.error("Error in liking: ", error.message);
        return response(res, 500, "Internal server error", error.message);

    }
};


const addCommentToPost = async (req, res) => {
    try {
        
        const { userId } = req.user; 
        const { postId } = req.params;
        const { text } = req.body;


        
        const post = await Post.findById(postId);

        if(!post) return response(res, 404, "Post not found!!!");

        post.comments.push({ user: userId, text });
        post.commentCount += 1;

        await post.save();

        return response(res, 201, "Comment added successfully!", post);



    } catch (error) {
        
        console.error("Error in added comments: ", error.message);
        return response(res, 500, "Internal server error", error.message);

    }
};


const createStory = async (req, res) => {
    try {
        
        const { userId } = req.user;

        if(!req.file) return response(res, 400, "Image or video is required to create story");

        let mediaUrl = null;
        let mediaType = null;
        let publicId = null

        if (req.file) {
            const uploadResult = await uploadFileToCloudinary(req.file);
            mediaUrl = uploadResult.secure_url;
            mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
            publicId = uploadResult.public_id;
            
        }

        // CREATE USER POST...
        const newStory = await new Story({
            user: userId,
            mediaUrl,
            mediaType,
            publicId
        })

        await newStory.save();

        return response(res, 201, "Story Created Successfully!", newStory);
         

    } catch (error) {

        console.error("Error Creating a Story: ", error.message);
        response(res, 500, "Internal server error", error.message);
        
    }
    
};


const getAllStory = async (req, res) => {
    try {
        
        const storys = await Story.find().sort({createdAt: -1}).populate("user", "_id username profilePicture email")

        return response(res, 201, "Get all story successfully!", storys);


    } catch (error) {
        
        console.error("Error getting all storys: ", error.message);
        return response(res, 500, "Internal server error", error.message);
        

    }
};

const deleteStory = async (req, res) => {
    const { storyId } = req.params;
    const { publicId,  mediaType } = req.body;
    

    if (!storyId) return response(res, 404, "Story not found");

    if (publicId) {
        await deleteFileFromCloudinary(publicId, mediaType);
    }
    

    await Story.findByIdAndDelete(storyId);



    return response(res, 200, "Story Deleted sucessFully!");
    
};


module.exports = {
    createPost,
    getAllPost,
    getPostByUserId,
    deletePost,
    likePost,
    addCommentToPost,
    sharePost,
    createStory,
    getAllStory,
    deleteStory
}