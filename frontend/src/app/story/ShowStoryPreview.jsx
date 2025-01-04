import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { X } from "lucide-react";
import React from "react";

const showStoryPreview = ({
  file,
  fileType,
  onClose,
  onPost,
  isNewStory,
  username,
  avatar,
  isLoading,
}) => {
  
  const userPlaceholder = username
    ?.split(" ")
    .map((name) => name[0])
    .join("");
  

  return (
    <div className="fixed  inset-0 bg-black bg-opacity-70 flex  items-center justify-center z-50">
      <div className="relative w-full  max-w-md  h-[70vh] flex  flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <Button
          className="absolute  top-4 right-4 z-10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          variant="ghost"
        >
          <X className="w-6 h-6 " onClick={onClose} />
        </Button>
        <div className="absolute top-4 left-4 z-10 flex items-center ">
          <Avatar className="w-10 h-10  mr-2">
            {avatar ? (
              <AvatarImage className="w-10 h-10 rounded-full" src={avatar} alt={username} />
            ) : (
              <AvatarFallback className="mt-4" >{userPlaceholder}</AvatarFallback>
            )}
          </Avatar>

          <span className=" text-gray-700 dark:text-gray-200 font-semibold">
            {username}
          </span>
        </div>

        <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          {fileType.split("/")[0] === "image" ? (
            <img
              src={file}
              alt="Story_preview"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={file}
              alt="Story_preview"
              autoPlay
              controls
              muted
              className="max-w-full max-h-full object-contain"
            ></video>
          )}
        </div>

        {isNewStory && (
          <div className="absolute bottom-4 right-4 transform -translate-x-1/2">
            <Button
              className="bg-blue-500 hover:bg-blue-800 text-white "
              onClick={onPost}
            >
              {isLoading ? "Saving..." : "Share"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default showStoryPreview;
