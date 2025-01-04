import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Ban,
  Delete,
  DeleteIcon,
  Edit,
  Edit2Icon,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostsComments from "@/app/posts/PostsComments";
import { useRouter } from "next/navigation";
import { formateDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { deletePost } from "@/services/post.service";
import { postStore } from "@/store/postStore";
import toast from "react-hot-toast";
import { fetchUserProfile } from "@/services/user.service";


function PostContents({ posts, postId, userId, isliked, onLike, onComment, onShare, isOwner }) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false)
  const { fetchUserPost } = postStore();


  const handleCommentClick = () => {
    setShowComments(true);
    setTimeout(() => {
      commentInputRef?.current?.focus();
    }, 0);
  };

  const generateSharedLink = () => {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${posts?.id}`;
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

  const handleDelte = async () => {
    const formData = {
      publicId: posts?.publicId,
      mediaType: posts?.mediaType
    }
    
    setLoading(true)
    await deletePost(postId, formData);
    setOpenDelete(false);
    await fetchUserPost(userId)
    toast.success("Post has deleted successfully! ")
    setLoading(false)
  };

  

  return (
    <motion.div
      key={posts?._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3 cursor-pointer">
              <Avatar>
                {posts?.user?.profilePicture ? (
                  <AvatarImage
                    src={posts?.user?.profilePicture}
                    alt={posts?.user?.username}
                  />
                ) : (
                  <AvatarFallback className="dark:bg-gray-500 dark:text-gray-300">
                    {userPlaceholder}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="">
                <p className="font-semibold dark:text-gray-200">
                  {posts?.user?.username}
                </p>
                <p className="font-sm text-gray-600 dark:text-gray-400">
                  {formateDate(posts?.createdAt)}
                </p>
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

          <p className="mb-4 dark:text-gray-100 ">{posts?.content}</p>

          {posts?.mediaUrl && posts.mediaType === "image" && (
            <img
              src={posts?.mediaUrl}
              alt={posts?._id}
              className="w-full h-auto rounded-lg mb-4 "
            />
          )}

          {posts?.mediaUrl && posts.mediaType === "video" && (
            <video controls className="w-full h-[500px] rounded-lg mb-4">
              <source src={posts.mediaUrl} type="video/mp4" />
              Your Browser Doesn't support The Video Tag
            </video>
          )}

          <div className="flex justify-between items-center mb-4 ">
            <span className="text-sm text-gray-500 dark:text-gray-200 hover:border-b-gray-200 cursor-pointer">
              {posts?.likeCount} Likes
            </span>

            <div className="flex gap-3 ">
              <span
                className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-gray-200 cursor-pointer"
                onClick={() => setShowComments(!showComments)}
              >
                {posts?.commentCount} Comments
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-400 hover:border-b-gray-200 cursor-pointer">
                {posts?.shareCount} Share
              </span>
            </div>
          </div>

          <Separator className="mb-2 dark:bg-gray-400" />

          <div className="flex justify-between w-16 sm:w-full mb-2  ">
            <Button
              variant="ghost"
              className={`flex-1  dark:hover:bg-gray-400 dark:text-gray-200 ${
                isliked ? "dark:text-blue-500 text-blue-500" : ""
              }`}
              onClick={onLike}
            >
              <ThumbsUp className="mr-2 h-4 w-4 " /> Like
            </Button>

            <Button
              variant="ghost"
              className={`flex-1 w-full sm:w-1 dark:hover:bg-gray-600 dark:text-gray-200 `}
              onClick={handleCommentClick}
            >
              <MessageCircle className="mr-2 h-4 w-4 " /> Comment
            </Button>

            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 w-full sm:w-1 dark:hover:bg-gray-500 dark:text-gray-200"
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
                <PostsComments
                  post={posts}
                  onComment={onComment}
                  commentInputRef={commentInputRef}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PostContents;
