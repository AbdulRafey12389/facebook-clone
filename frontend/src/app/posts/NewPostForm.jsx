import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ImageIcon, Laugh, Plus, Video, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";

import dynamic from "next/dynamic";
import userStore from "@/store/userStore";
import { postStore } from "@/store/postStore";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

function NewPostForm({ ispostFormOpen, setIspostFormOpen }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const inputFileRef = useRef(null)
  const [showImageUpload, setShowImageUpload] = useState(false);
  const { user } = userStore();
  const { handleCreatePost, fetchPost } = postStore();



  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleEmojiClick = (emojiObject) => {
    setPostContent((prev) => prev + emojiObject.emoji);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file), setFileType(file.type);
    setFilePreview(URL.createObjectURL(file));
  };

  const handlePost = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", postContent);
      if (selectedFile) {
        formData.append("media", selectedFile);
      }

      await handleCreatePost(formData);
      await fetchPost();
      
      setPostContent("");
      setSelectedFile(null);
      setFilePreview(null);
      setIspostFormOpen(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Card className="mt-2 2xl:w-[100%]">
      <CardContent className="p-4 ">
        <div className="flex space-x-4">
          <Avatar>
            {user?.profilePicture ? (
              <AvatarImage src={user?.profilePicture} alt={user?.username} />
            ) : (
              <AvatarFallback className="dark:bg-gray-500 dark:text-gray-300">
                {userPlaceholder}
              </AvatarFallback>
            )}
          </Avatar>
          <Dialog open={ispostFormOpen} onOpenChange={setIspostFormOpen}>
            <DialogTrigger className="w-full">
              <Input
                placeholder={`What's On Your Mind, ${user?.username}`}
                readOnly
                className="cursor-pointer rounded-full h-12 dark:bg-[rgb(58,59,60)] placeholder:text-gray-500 placeholder:dark:text-gray-400"
              />
              <Separator className="my-2 dark:bg-slate-400" />
              <div className="flex justify-between ">
                <Button
                  className="flex justify-center items-center"
                  variant="ghost"
                >
                  <ImageIcon className="h-5 w-5 text-green-500 mr-2 " />
                  <span className="dark:text-slate-100">Photo</span>
                </Button>

                <Button
                  className="flex justify-center items-center"
                  variant="ghost"
                >
                  <Video className="h-5 w-5 text-red-500 mr-2 " />
                  <span className="dark:text-slate-100">Video</span>
                </Button>

                <Button
                  className="flex justify-center items-center"
                  variant="ghost"
                >
                  <Laugh className="h-5 w-5 text-orange-500 mr-2 " />
                  <span className="dark:text-slate-100">Feelings</span>
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center">Create Post</DialogTitle>
              </DialogHeader>

              <Separator />

              <div className="flex items-center space-x-2 py-4 ">
                <Avatar className="h-10 w-10">
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                    />
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold">{user?.username}</p>
                </div>
              </div>

              <Textarea
                placeholder={`What's On Your Mind? ${user?.username}`}
                className="min-h-[100px] text-lg"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />

              <AnimatePresence>
                {(showImageUpload || filePreview) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-start "
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setShowImageUpload(false);
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    {filePreview ? (
                      fileType.startsWith("image") ? (
                        <img src={filePreview} alt="preview_image" className="w-full h-full max-h-[300px] object-cover" />
                      ) : (
                        <video controls src={filePreview} className="w-full h-full max-h-[300px] object-cover"></video>
                      )
                    ) : (
                      <>
                        <Plus className="h-12 w-12 text-gray-400 mb-2 cursor-pointer" onClick={() => inputFileRef.current.click()} />
                        <div className="text-gray-500 text-center">
                          Add Photo/Video
                        </div>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                      ref={inputFileRef}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-gray-200 dark:bg-muted p-4 rounded-lg mt-4 ">
                <p className="font-semibold mb-2">Add Your Post </p>

                <div className="flex space-x-2">
                  <Button size="icon" variant="outline" onClick={() => setShowImageUpload(!showImageUpload)}>
                    <ImageIcon className="h-4 w-4 text-green-500 " />
                  </Button>

                  <Button size="icon" variant="outline" onClick={() => setShowImageUpload(!showImageUpload)} >
                    <Video className="h-4 w-4 text-red-500 " />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Laugh className="h-4 w-4 text-orange-500 " />
                  </Button>
                </div>
              </div>

              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 1, y: 20 }}
                  className="relative "
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 z-10"
                    onClick={() => setShowEmojiPicker(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <Picker onEmojiClick={handleEmojiClick} />
                </motion.div>
              )}

              <div className="flex justify-end mt-4 ">
                <Button className="bg-blue-500 text-white hover:text-blue-500" onClick={handlePost}>
                  { loading ? "Saving..." : "Post" }
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default NewPostForm;
