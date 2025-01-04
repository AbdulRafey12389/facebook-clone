const User = require("../models/userModel");
const response = require("../utils/responseHandler");




const getAllUser = async (req, res) => {
    try {
        
        const users = await User.find().select("username email profilePicture followerCount _id");
        

        return response(res, 200, "All user get successfully!", users);

    } catch (error) {
        
        console.error("Error getting all user: ", error.message);
        return response(res, 501, "Internal server error", error.message);

    }
};



const followUser = async (req, res) => {
    try {
        
        const  { userIdToFollow } = req.body;
        const { userId } = req?.user;
        const userToFollow = await User.findById(userIdToFollow);
        const currentUser = await User.findById(userId);

        if (userId === userIdToFollow) return response(res, 400, "You are not allowed to follow yourself!!!");

        if (!userToFollow || !currentUser) return response(res, 404, "User not found" )

        if (currentUser.following.includes(userIdToFollow)) return response(res, 401, "User already following this user!!!");

        currentUser.following.push(userIdToFollow);

        userToFollow.followers.push(currentUser);

        currentUser.followingCount += 1;
        userToFollow.followerCount += 1;

        await userToFollow.save();
        await currentUser.save();

        return response(res, 200, "User followed successfully!",)


    } catch (error) {
        
        console.error("Error following users: ", error.message);
        return response(res, 501, "Internal servar error!!!", error.message);
        

    }
};


const unFollowUser = async (req, res) => {
    try {
        
        const { userIdToUnfollow } = req.body;
        const { userId } = req?.user;
        const userToUnfollow = await User.findById(userIdToUnfollow);
        const currentUser = await User.findById(userId);

        if (userToUnfollow === currentUser) return response(res, 401, "You cannot unfollow yourself!!!")

        if (!userToUnfollow || !currentUser) return response(res, 404, "User not found!!!");

        if (!currentUser.following.includes(userIdToUnfollow)) return response(res, 401, "You are not following this user!!!");

        currentUser.following = currentUser.following.filter(id => id.toString() !== userIdToUnfollow);

        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId);

        currentUser.followingCount -= 1;
        userToUnfollow.followerCount -= 1;

        await currentUser.save();
        await userToUnfollow.save();

        return response(res, 201, "User Unfollow sccessfully!");


    } catch (error) {
        
        console.error("Error to unfollow user: ", error.message);
        return response(res, 501, "Internal server error!!!", error.message);
        

    }
};


const deleteUserFromRequest = async (req, res) => {
    try {
        
        const { userId } = req?.user;
        const { reqeustSenderId } = req.body;
        const requestToSender = await User.findById(reqeustSenderId);
        const currentUser = await User.findById(userId);

        if (!requestToSender || !currentUser) return response(res, 404, "User not found!!!");

        const isRequestSender = requestToSender.following.includes(userId);

        if (!isRequestSender) return response(res, 401, "No request found for this user!!!");

        requestToSender.following = requestToSender.following.filter(user => user.toString() !== userId);

        currentUser.followers = currentUser.followers.filter(user => user.toString() !== reqeustSenderId);

        currentUser.followerCount = currentUser.followers.length;
        requestToSender.followerCount = requestToSender.following.length;

        await requestToSender.save();
        await currentUser.save();

        return response(res, 200, `Friends request from ${requestToSender.username} deleted Successfully`);




    } catch (error) {
        
        console.error("Error to delete request from user: ", error.message);
        return response(res, 501, "Internal server error!!!", error.message);

    }
};


const getAllFreindRequest = async (req, res) => {
    try {
        
        const { userId } = req.user;

        const currentUser = await User.findById(userId).select("followers following");

        if (!currentUser) return response(res, 404, "User not found!!!");

        const userToFollowBack = await User.find({
            _id: {
                $in: currentUser.followers,
                $nin: currentUser.following
            }
        }).select("username profilePicture email followerCount");
         
        return response(res, 200, "User to follow back get successfully!", userToFollowBack);


    } catch (error) {

        console.error("Error to get all friend request: ", error.message);
        return response(res, 501, "Internal server error!!!", error.message);
    }
};


const getAllUserForRequest = async (req, res) => {
    try {
        
        const { userId } = req.user;

        const currentUser = await User.findById(userId).select("followers following");

        if (!currentUser) return response(res, 404, "User not found!!!");

        const userForFriendRequest = await User.find({
            _id: {
                $ne: currentUser,
                $nin: [ ...currentUser.following, ...currentUser.followers ]
            }
        }).select("username profilePicture email followerCount");
         
        return response(res, 200, "User get all friend request successfully!", userForFriendRequest);


    } catch (error) {

        console.error("Error to get all friend request: ", error.message);
        return response(res, 501, "Internal server error!!!", error.message);
    }
};


const getAllMutualFriends = async (req, res) => {
    try {
        
        const { userId } = req.params;

        const currentUser = await User.findById(userId).select("followers following").populate("followers", "username profilePicture email email followerCount followingCount").populate("following", "username profilePicture email email followerCount");


        if (!currentUser) return response(res, 404, "User not found!!!");

        const followingUserId = new Set(currentUser.following.map(user => user._id.toString()));


        const mutualFriend = currentUser.followers.filter(follower => followingUserId.has(follower._id.toString()));

        return response(res, 200, "Mutual freinds get successfully!", mutualFriend);


    } catch (error) {

        console.error("Error to get mutual friends: ", error.message);
        return response(res, 501, "Internal server error!!!", error.message);
    }
};


const checkUserAuth = async (req, res) => {
    try {
        
        const { userId } = req?.user;

        if (!userId) return response(res, 404, "User unauthenticated! please login before access data!!! ");

        const user = await User.findById(userId).select("-password");

        if (!user) return response(res, 403, "User not found!!!");

        return response(res, 200, "User retrive and allowed to use facebook!", user);

    } catch (error) {
        
        console.error("Error to checkAuth: ", error.message);
        return response(res, 501, "Internal server error", error.message);

    }
};


const getUserProfile = async (req, res) => {
    try {
        
        const { userId }  = req.params;
        const loggedInUserId = req?.user?.userId;

        const userProfile = await User.findById(userId).select("-password").populate("bio").exec();

        if (!userProfile) return response(res, 403, "User not found!!!");

        const isOwner = userId === loggedInUserId;

        return response(res, 200, "User Profile get seccessfully!", { profile: userProfile, isOwner });


    } catch (error) {

        console.error("Error to getting user profile: ", error.message);
        return response(res, 501, "Internal server error", error.message);

    }
};



module.exports = {
    getAllUser,
    followUser,
    unFollowUser,
    deleteUserFromRequest,
    getAllFreindRequest,
    getAllUserForRequest,
    getAllMutualFriends,
    checkUserAuth,
    getUserProfile
}