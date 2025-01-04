import { commentsPost, createPost, createStory, getAllPost, getAllStory, getAllUserPost, likePost, sharePost } from "@/services/post.service";
import toast from "react-hot-toast";
import { create } from "zustand";



export const postStore = create((set) => ({
    posts: [],
    userPosts: [],
    storys: [],
    loading: false,
    error: null,

    fetchPost: async () => {
        set({ loading: true })
        try {
            const posts = await getAllPost();
            set({posts, loading: false})
        } catch (error) {
            set({error, loading: false})
        }
    },

    fetchUserPost: async (userId) => {
        set({ loading: true })
        try {
            const userPosts = await getAllUserPost(userId);
            set({userPosts, loading: false})
        } catch (error) {
            set({error, loading: false})
        }
    },

    fetchStory: async () => {
        set({ loading: true })
        try {
            const storys = await getAllStory();
            set({storys, loading: false})
        } catch (error) {
            set({error, loading: false})
        }
    },

    handleCreatePost: async (postData) => {
        set({ loading: true })
        try {
            const newPost = await createPost(postData);
            set((state) => ({
                posts: [newPost, ...state.posts],
                loading: false
            }));
            toast.success("Post created successfully!");
        } catch (error) {
            set({error, loading: false});
            toast.error("Faild to create post!!!");
        }
    },

    handleCreateStory: async (story) => {
        set({ loading: true })
        try {
            const newStory = await createStory(story);
            set((state) => ({
                storys: [newStory, ...state.storys],
                loading: false
            }));
            toast.success("Story created successfully!");
        } catch (error) {
            set({error, loading: false});
            toast.error("Faild to create story!!!");
        }
    },

    handleLikePost: async (postId) => {
        set({ loading: true })
        try {
             await likePost(postId);
        } catch (error) {
            set({error, loading: false});
        }
    },

    handleCommentPost: async (postId, text) => {
        set({ loading: true })
        try {
            const newComments = await commentsPost(postId, text);
            
            set((state) => ({
                posts: state.posts.map(post => 
                    post?._id === postId ? { ...post, comments: [...post.comments, newComments] } : post
                )
            }))

            toast.success("comment added successfully!");
        } catch (error) {
            set({error, loading: false});
            toast.error("Faild to add comments!!!");
        }
    },

    handlesharePost: async (postId) => {
        
        set({ loading: true })
        try {
            await sharePost(postId);
            toast.success("Post share successfully!");
        } catch (error) {
            set({error, loading: false});
            toast.error("Faild to share this post!!!");
        }
    },

    


}))