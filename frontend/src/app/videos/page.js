"use client";

import React, { useEffect, useState, useRef } from "react";
import LeftSidebar from "../components/LeftSidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import VideoCard from "./VideoCard";
import { postStore } from "@/store/postStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function Page() {
  const [ispostFormOpen, setIspostFormOpen] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());
  const router = useRouter();

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

  const videoPosts = posts?.filter((post) => post.mediaType === "video");

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="mt-12 min-h-screen">
      <LeftSidebar />

      <main className="ml-0 md:ml-64 p-6 ">
        <Button variant="ghost" className="mb-4" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to feed
        </Button>

        <div className="w-full mx-auto">
          {videoPosts.map((post) => (
            <VideoCard
              key={post?._id}
              post={post}
              isliked={likePosts.has(post?._id)}
              onLike={() => handleLike(post?._id)}
              onComment={async (comment) => {
                await handleCommentPost(post?._id, comment), await fetchPost();
              }}
              onShare={async () => {
                await handlesharePost(post?._id);
                await fetchPost();
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Page;
