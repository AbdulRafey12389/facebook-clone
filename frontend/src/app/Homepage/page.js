"use client";

import React, { useEffect, useState } from "react";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import StorySection from "../story/StorySection";
import NewPostForm from "../posts/NewPostForm";
import PostCard from "../posts/PostCard";
import { postStore } from "@/store/postStore";
import toast from "react-hot-toast";

function Homepage() {
  const [ispostFormOpen, setIspostFormOpen] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());

  const {
    posts,
    fetchPost,
    handleLikePost,
    handleCommentPost,
    handlesharePost,
  } = postStore();

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    const savesLikes = localStorage.getItem("likePosts");
    if (savesLikes) {
      setLikePosts(new Set(JSON.parse(savesLikes)));
    }
  }, []);

  const handleLike = async (postId) => {
    const updatedLikePost = new Set(likePosts);
    if (updatedLikePost.has(postId)) {
      updatedLikePost.delete(postId);
      toast.error("Post unlike successfully!!!");
    } else {
      updatedLikePost.add(postId);
      toast.success("Post like successfully!");
    }

    setLikePosts(updatedLikePost);
    localStorage.setItem(
      "likePosts",
      JSON.stringify(Array.from(updatedLikePost))
    );

    try {
      await handleLikePost(postId);
      await fetchPost();
    } catch (error) {
      console.log(error);
      toast.error("Failed to like or unlike post!!!");
    }
  };

  return (
    <div className="flex flex-col bg-background text-foreground ">
      <main className="flex flex-1 pt-16  2xl:justify-center">
        <LeftSidebar />

        <div className="flex-1 px-4 py-6 md:ml-64 2xl:ml-[-120px] lg:mr-64 lg:max-w-2xl xl:max-w-2xl mx-auto">
          <div className="ml-2 xl:ml-20 2xl:w-[40vw]">
            <StorySection />

            <NewPostForm
              ispostFormOpen={ispostFormOpen}
              setIspostFormOpen={setIspostFormOpen}
            />

            <div className="mt-6 space-y-6 mb-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  posts={post}
                  isliked={likePosts.has(post?._id)}
                  onLike={() => handleLike(post?._id)}
                  onComment={ async (comment) => {
                    await handleCommentPost(post?._id, comment),
                    await fetchPost();
                  }}
                  onShare={ async () => {
                    await handlesharePost(post?._id);
                    await fetchPost();
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-64 xl:w-80 fixed right-0 top-16 bottom-0 overflow-y-auto p-4">
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}

export default Homepage;
