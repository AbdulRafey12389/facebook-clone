"use client";

import React, { useState, useEffect, useRef } from "react";
import LeftSidebar from "../components/LeftSidebar";
import { FriendCardSkeleton, NoFriendsMessage } from "@/lib/Skeleten";
import FriendsRequest from "./FriendsRequest";
import FriendsSuggestion from "./FriendsSuggestion";
import { friendStore } from "@/store/userFriendsRequestStore";
import toast from "react-hot-toast";
import { unFollowUser } from "@/services/user.service";

function Page() {
  const {
    fetchFriendRequest,
    mutualFriends,
    friendSuggestion,
    friendRequests,
    deleteUserFromRequest,
    followUser,
    fetchMutualFriends,
    fetchFriendSuggestion,
    loading
  } = friendStore();

  useEffect(() => {
    fetchFriendRequest();
    fetchFriendSuggestion();

  }, [])

  const handleAction = async (action, userId) => {
    if (action === 'confirm') {
      toast.success("Friend added successfully!")
      await followUser(userId);
      fetchFriendRequest();
      fetchFriendSuggestion();
    }else if (action === "delete") {
      await deleteUserFromRequest(userId);
      fetchFriendRequest();

    }else if (action === "add-friend") {
      toast.success("Friend request sent successfully!")
      await followUser(userId);
      fetchFriendRequest();
      fetchFriendSuggestion();
    }
  };
  


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[rgb(36,37,38)] ">
      <LeftSidebar />

      <main className="ml-0 md:ml-64 mt-16 p-6">
        <h1 className="text-2xl font-bold mb-6 ">Friends Requests</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {loading ? (
            <FriendCardSkeleton />
          ) : friendRequests.length === 0 ? (
            <NoFriendsMessage
              text="No Friend Requests"
              description="Looks like you're all caught up! Why not explore and connect with new people?"
            />
          ) : (
            friendRequests.map((friend) => <FriendsRequest key={friend?._id} friend={friend} loading={loading} onAction={handleAction} />)
          )}
        </div>

        {/* FRIEND SUGESTION SECTION */}
        <h1 className="text-2xl font-bold mb-6 ">People you may know</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {loading ? (
            <FriendCardSkeleton />
          ) : friendSuggestion.length === 0 ? (
            <NoFriendsMessage
              text="No Friend Suggestions"
              description="Looks like you're all caught up! Why not explore and connect with new people?"
            />
          ) : (
            friendSuggestion.map((friend) => (
              <FriendsSuggestion key={friend?._id} friend={friend} loading={loading} onAction={handleAction} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Page;
