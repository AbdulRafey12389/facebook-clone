"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useSidebarStore from "@/store/sidebarStore";
import userStore from "@/store/userStore";
import { Bell, Home, MessageCircle, User, Users, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function LeftSidebar() {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const router = useRouter();

  const { user } = userStore();
  const userPlaceholder = user?.username
    .split(" ")
    .map((name) => name[0])
    .join("")
    ?.toUpperCase();

  const handleNavigation = (path, item) => {
    router.push(path);
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  return (
    <div>
      <aside
        className={`fixed top-16 left-0 h-full w-64 p-4 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${
          isSidebarOpen
            ? "translate-x-0 bg-white dark:bg-[rgb(36,37,38)] shadow-lg"
            : "-translate-x-full "
        } ${isSidebarOpen ? "md:hidden" : ""} md:bg-transparent md:shadow-none`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <nav className="space-y-6 flex-grow ">
            <div
              className="flex items-center space-x-2 cursor-pointer "
              onClick={() => handleNavigation(`/userProfile/${user?._id}`)}
            >
              <Avatar>
                {user?.profilePicture ? (
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.username}
                  />
                ) : (
                  <AvatarFallback>{userPlaceholder}</AvatarFallback>
                )}
              </Avatar>
              <span className="font-semibold">{user?.username}</span>
            </div>

            <Button
              variant="ghost"
              className="full justify-start"
              onClick={() => handleNavigation("/")}
            >
              <Home className="mr-4" /> Home
            </Button>

            <Button
              variant="ghost"
              className="full justify-start"
              onClick={() => handleNavigation("/friends-list")}
            >
              <Users className="mr-4" /> Friends
            </Button>

            <Button
              variant="ghost"
              className="full justify-start"
              onClick={() => handleNavigation(`/userProfile/${user?._id}`)}
            >
              <User className="mr-4" /> Profile
            </Button>

            <Button
              variant="ghost"
              className="full justify-start"
              onClick={() => handleNavigation("/videos")}
            >
              <Video className="ml-1 mr-4" /> Video
            </Button>

            <Button variant="ghost" className="full justify-start">
              <MessageCircle className="mr-4" /> Messages
            </Button>

            <Button variant="ghost" className="full justify-start">
              <Bell className="mr-4" /> Notifications
            </Button>
          </nav>

          <div className="mb-16 ">
            <Separator className="my-4" />
            <div
              className="flex items-center space-x-2 mb-4 cursor-pointer "
              onClick={() => handleNavigation(`/userProfile/${user?._id}`)}
            >
              <Avatar>
                {user?.profilePicture ? (
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.username}
                  />
                ) : (
                  <AvatarFallback>{userPlaceholder}</AvatarFallback>
                )}
              </Avatar>
              <span className="font-semibold">{user?.username}</span>
            </div>
            <div className="text-xs text-muted-foreground sapce-y-1 ">
              <p>Privacy - Terms - Advertisting </p>
              <p> meta &copy; 2024</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default LeftSidebar;
