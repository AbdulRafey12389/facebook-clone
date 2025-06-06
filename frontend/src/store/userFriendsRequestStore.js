import { deleteUserFromRequest, followUser, getAllFriendsRequest, getAllFriendsSuggestion, getMutualFriends, unFollowUser } from "@/services/user.service";
import toast from "react-hot-toast";
import { create } from "zustand";




export const friendStore = create((set, get) => ({
    friendRequests: [],
    friendSuggestion: [],
    mutualFriends: [],
    loading: false,

    fetchFriendRequest: async () => {
        set({ loading: true });
        try {
            const friend = await getAllFriendsRequest();
            set({friendRequests: friend.data, loading: false})
        } catch (error) {
            set({ error, loading: false })
        }finally {
            set({loading: false})
        }
    },

    fetchFriendSuggestion: async () => {
        set({ loading: true });
        try {
            const friend = await getAllFriendsSuggestion();
            set({friendSuggestion: friend.data, loading: false})
        } catch (error) {
            set({ error, loading: false })
        }finally {
            set({loading: false})
        }
    },

    fetchMutualFriends: async (userId) => {
        set({ loading: true });
        try {
            const friend = await getMutualFriends(userId);
            set({mutualFriends: friend, loading: false})
        } catch (error) {
            set({ error, loading: false })
        }finally {
            set({loading: false})
        }
    },

    followUser: async (userId) => {
        try {
            await followUser(userId);
        } catch (error) {
            console.log(error);
            
        }
    },


    unFollowUser: async (userId) => {
        try {
            await unFollowUser(userId);
        } catch (error) {
            console.log(error);
            
        }
    },

    deleteUserFromRequest: async (userId) => {
        try {
            await deleteUserFromRequest(userId);
            toast.success("You have deleted friend successfully!")
        } catch (error) {
            console.log(error);
            
        }
    },


}))