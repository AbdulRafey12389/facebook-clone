"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { postStore } from "@/store/postStore";
import userStore from "@/store/userStore";
import { Ban, Delete, Edit2Icon, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import ShowStoryPreview from "./ShowStoryPreview";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchUserProfile } from "@/services/user.service";
import { deleteStory } from "@/services/post.service";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function StoryCard({ isAddStory, story }) {
  const [isNewStory, setIsNewStory] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const inputFileRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const { user } = userStore();
  const { handleCreateStory, fetchStory } = postStore();
  const [openDelete, setOpenDelete] = useState(false);
  const [isOwner, setIsOwner] = useState(null);
  const cardRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setFileType(file.type);
      setFilePreview(URL.createObjectURL(file));
      setIsNewStory(true);
      setShowPreview(true);
    }

    e.target.value = "";
  };

  const handleStory = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      if (selectedFile) {
        formData.append("media", selectedFile);
      }
      setLoading(true);
      await handleCreateStory(formData);
      await fetchStory();
      resetStoryState();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleClosePreview = () => {
    resetStoryState();
  };

  const resetStoryState = () => {
    setShowPreview(false);
    setSelectedFile(null);
    setFilePreview(null);
    setIsNewStory(false);
    setFileType(null);
    setLoading(false)
  };

  const handleStoryClick = () => {
    setFilePreview(story?.mediaUrl);
    setFileType(story?.mediaType);
    setIsNewStory(false);
    setShowPreview(true);
  };

  const userPlaceholder = story?.user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

    useEffect(() => {
    
      (async() => {
        if (story?.user?._id) {
          const result = await fetchUserProfile(story?.user?._id);
          setIsOwner(result?.isOwner)
        }
      })()
  
    }, [story?.user?._id]);
    


    const handleDelte = async () => {
      setShowPreview(false);
      const formData = {
        publicId: story?.publicId,
        mediaType: story?.mediaType
      }
      
      setLoading(true)
      await deleteStory(story?._id, formData);
      setOpenDelete(false);
      await fetchStory();
      toast.success("Story has deleted successfully! ")
      setLoading(false);
      resetStoryState();
    };
    

  return (
    <>
      <Card
        className="w-40 h-60 relative overflow-hidden group cursor-pointer rounded-xl"
        onClick={isAddStory ? undefined : handleStoryClick}
        // disabled={openDelete}
        ref={cardRef}
      >
        <CardContent className="p-0 h-full">
          {isAddStory ? (
            <div className="w-full h-full flex flex-col">
              <div className="h-3/4 w-full relative border-b">
                <Avatar className="w-full h-full rounded-none">
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                    />
                  ) : (
                    <p className="dark:text-gray-500  w-full h-full flex justify-center items-center text-4xl">
                      {userPlaceholder}
                    </p>
                  )}
                </Avatar>
              </div>

              <div
                className="h-1/4 w-full bg-white dark:bg-gray-800 flex flex-colo
                items-center justify-center"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600"
                >
                  <Plus
                    className="h-5 w-5 text-white"
                    onClick={() => inputFileRef.current.click()}
                  />
                </Button>
                <p className="text-xs font-semibold mt-1 ml-2 dark:text-white">
                  Create Story
                </p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
                ref={inputFileRef}
              />
            </div>
          ) : (
            <>
              {story?.mediaType === "image" ? (
                <img
                  src={story?.mediaUrl}
                  alt={story?.user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={story?.mediaUrl}
                  alt={story.user.username}
                  className="w-full h-full object-cover"
                ></video>
              )}
              <div className="absolute flex items-center justify-between w-full top-2 left-2 pr-4 z-20">
                <div className=" top-2 left-2 ring-2 ring-blue-500 rounded-full">
                <Avatar className="w-8 h-8">
                  {story?.user?.profilePicture ? (
                    <AvatarImage
                      src={story?.user?.profilePicture}
                      alt={story?.user?.username}
                    />
                  ) : (
                    <AvatarFallback className="dark:bg-gray-500 dark:text-gray-300">
                      {userPlaceholder}
                    </AvatarFallback>
                  )}
                </Avatar>
                </div>

                <DropdownMenu className="z-20">
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-6 w-6 dark:text-black" />
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
                      onClick={() => {
                        setOpenDelete(false);
                        handleClosePreview();

                        
                      }}
                    >
                      <Ban className="mr-2 h-5 w-5 " /> Cancel
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

              </div>

              <div className="absolute bottom-2 left-2 right-2 ">
                <p className="text-white text-xs font-semibold truncate">
                  {story?.user?.username}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {!openDelete && showPreview && (
        <ShowStoryPreview
          file={filePreview}
          fileType={fileType}
          onClose={handleClosePreview}
          onPost={handleStory}
          isNewStory={isNewStory}
          username={isNewStory ? user?.username : story?.user.username}
          isLoading={loading}
          avatar={
            isNewStory ? user?.profilePicture : story?.user?.profilePicture
          }
        />
      )}
    </>
  );
}

export default StoryCard;
