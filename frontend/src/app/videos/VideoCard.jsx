"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ban, Clock, Delete, Edit2Icon, MessageCircle, MoreHorizontal, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import VideoComments from "./VideoComments";
import { Input } from "@/components/ui/input";
import userStore from "@/store/userStore";
import { formatDateOfTime, formateDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { postStore } from "@/store/postStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchUserProfile } from "@/services/user.service";
import { deletePost } from "@/services/post.service";

function VideoCard({ post, isliked, onShare, onComment, onLike }) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const commentInputRef = useRef(null);
  const { user } = userStore();
  const { fetchPost } = postStore();
  const [isOwner, setIsOwner] = useState(null);



  const generateSharedLink = () => {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${post?.id}`;
  };

  const handleShare = (platForm) => {
    const url = generateSharedLink();
    let shareUrl;

    switch (platForm) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setIsShareDialogOpen(false);
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
    setIsShareDialogOpen(false);
  };

  const userPlaceholder = post?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const commentPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleCommentClick = () => {
    setShowComments(true);
    setTimeout(() => {
      commentInputRef?.current?.focus();
    }, 0);
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      onComment({ text: commentText });
      setCommentText("");
    }
  };

  useEffect(() => {
    
    (async() => {
      if (post?.user?._id) {
        const result = await fetchUserProfile(post?.user?._id);
        setIsOwner(result?.isOwner)
      }
    })()

  }, [post?.user?._id]);

  const handleDelte = async () => {
    const formData = {
      publicId: post?.publicId,
      mediaType: post?.mediaType
    }
    
    setLoading(true)
    await deletePost(post?._id, formData);
    setOpenDelete(false);
    await fetchPost();
    toast.success("Video has deleted successfully! ")
    setLoading(false)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-[rgb(36,37,38)] rounded-lg shadow-lg overflow-hidden 2xl:w-[60vw]"
    >
      <div>
        <div className="flex items-center justify-between mb-4 px-4 mt-2">
          <div className="flex items-center">
            <Avatar className="mr-2">
              {post?.user?.profilePicture ? (
                <AvatarImage
                  src={post?.user?.profilePicture}
                  alt={post?.user?.username}
                />
              ) : (
                <AvatarFallback className="dark:bg-gray-500 dark:text-gray-300">
                  {userPlaceholder}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="">
              <p className="font-semibold dark:text-gray-200">{user?.username}</p>
            </div>
          </div>

          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4 dark:text-gray-200" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setOpenDelete(true)}>
                  <Delete className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    { isOwner ? "Are you sure do you want to delete your post ?" : "Opps Access Denied"}
                  </DialogTitle>

                  <DialogDescription>
                    { isOwner ? " If you proceed with this action, your post will bepermanently deleted and cannot be recovered. Please considercarefully before deciding to delete your post." : <>
                     <div className="flex items-center justify-center"><Ban className="w-16 h-16 mr-2" /> Opps sorry you are not able delete this post because this post is not yours</div>
                    </> }
                  </DialogDescription>
                </DialogHeader>

                {isOwner && (
                  <div>
                    <Button
                      className="flex-1 hover:bg-red-600 bg-red-500 dark:text-white mr-4"
                      onClick={handleDelte}
                    >
                      <Trash2 className="mr-2 h-5 w-5 " /> {loading ? "Deleting..." : "Delete"}
                    </Button>

                    <Button
                      className="flex-1 hover:bg-blue-600 bg-blue-500 dark:text-white font-bold "
                      onClick={() =>setOpenDelete(false)}
                    >
                      <Ban className="mr-2 h-5 w-5 " /> Cancel
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
        </div>

        <div className="relative aspect-video bg-black mb-4">
          {post?.mediaUrl && (
            <video
              controls
              autoPlay
              muted
              className="w-full  h-[200] sm:h-[400px] lg:h-[700px]  2xl:h-full rounded-lg mb-4"
            >
              <source src={post.mediaUrl} type="video/mp4" />
              Your Browser Doesn't support The Video Tag
            </video>
          )}
        </div>

        <div className="md:flex flex-wrap justify-between items-center px-2 mb-2">
          <div className="flex space-x-4 ">
            <Button
              variant="ghost"
              className={`flex dark:hover:bg-gray-400 dark:text-gray-200 items-center ${
                isliked ? "dark:text-blue-500" : ""
              } `}
              onClick={onLike}
            >
              <ThumbsUp className="mr-2 h-4 w-4 " /> <span>Like</span>
            </Button>

            <Button
              variant="ghost"
              className={`flex items-center dark:hover:bg-gray-600 dark:text-gray-200 `}
              onClick={handleCommentClick}
            >
              <MessageCircle className="mr-2 h-4 w-4 " /> <span>Comment</span>
            </Button>

            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center dark:hover:bg-gray-500 dark:text-gray-200"
                  onClick={onShare}
                >
                  <Share2 className="mr-2 h-4 w-4 " /> Share
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle> Share This Post</DialogTitle>
                  <DialogDescription>
                    Choose How You Want Share This Post{" "}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4 ">
                  <Button onClick={() => handleShare("facebook")}>
                    Share On Facebook
                  </Button>
                  <Button onClick={() => handleShare("twitter")}>
                    Share On Twitter
                  </Button>
                  <Button onClick={() => handleShare("linkedin")}>
                    Share On Linkedin
                  </Button>
                  <Button onClick={() => handleShare("copy")}>Copy Link</Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex items-center truncate justify-end text-gray-500 dark:text-gray-400 w-full pr-4">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{formateDate(post.createdAt)}</span>
          </div>
          </div>

          <div className="flex flex-wrap space-x-4 ml-2 text-sm text-gray-500 dark:text-gray-400 ">
            <Button variant="ghost" size="sm">
              {post?.likeCount} Likes
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowComments(!showComments);
              }}
            >
              {post?.commentCount} Comments
            </Button>

            <Button variant="ghost" size="sm">
              {post?.shareCount} Share
            </Button>
          </div>
        </div>

        <Separator className="mb-2 dark:bg-gray-400" />

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScrollArea className="h-[300px] w-full  rounded-md border p-4">
                <VideoComments key={post?.comments?._id} comments={post?.comments} />
              </ScrollArea>

              <div className="mt-4 flex items-center">
                <Avatar className="h-10 w-10 rounded mr-3">
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                    />
                  ) : (
                    <AvatarFallback className="dark:bg-gray-500 dark:text-gray-300">
                      {commentPlaceholder}
                    </AvatarFallback>
                  )}
                </Avatar>

                <Input
                  className="flex-1 mr-2 dark:border-gray-400"
                  placeholder="Write something..."
                  value={commentText}
                  ref={commentInputRef}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                />

                <Button onClick={handleCommentSubmit}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default VideoCard;
