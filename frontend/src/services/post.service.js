import axiosInstance from "./url.service";



export const createPost = async (postData) => {
    try {
        const result = await axiosInstance.post("/users/post", postData);
        return result?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



export const getAllPost = async () => {
    try {
        const result = await axiosInstance.get("/users/posts");
        return result?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


export const getAllUserPost = async (userId) => {
    try {
        const result = await axiosInstance.get(`users/posts/user/${userId}`);
        return result?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deletePost = async (userId, formData) => {
    try {
        const result = await axiosInstance.post(`users/posts/delete/${userId}`, formData);
        return result?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};



export const createStory = async (storyData) => {
    try {
        const result = await axiosInstance.post("/users/story", storyData);
        return result?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getAllStory = async () => {
    try {
        const result = await axiosInstance.get("/users/story");
        return result?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteStory = async (storyId, data) => {
    try {
        const result = await axiosInstance.post(`/users/story/delete/${storyId}`, data);
        return result?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const likePost = async (postId) => {
    try {
        const result = await axiosInstance.post(`/users/posts/likes/${postId}`);
        return result?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const commentsPost = async (postId, comment) => {
    try {
        const result = await axiosInstance.post(`/users/posts/comments/${postId}`, comment);
        return result?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


export const sharePost = async (postId) => {
    try {
        const result = await axiosInstance.post(`/users/posts/shares/${postId}`);
        return result?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};