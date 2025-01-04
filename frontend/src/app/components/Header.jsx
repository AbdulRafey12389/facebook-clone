"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Loader from "@/lib/Loader";
import { logoutUser } from "@/services/auth.service";
import { getAllusers } from "@/services/user.service";
import useSidebarStore from "@/store/sidebarStore";
import userStore from "@/store/userStore";
import {
  Ban,
  Bell,
  Home,
  icons,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Sun,
  User,
  Users,
  Video,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("home");
  const { theme, setTheme } = useTheme();
  const { toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const { user, clearUser } = userStore();

  const searchRef = useRef();

  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleNavigation = (path, item) => {
    router.push(path);
    setActive(item)
  };

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result?.status === "success") {
        router.push("/userLogin");
        clearUser();
      }
      toast.success("User logout successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Faild to logout!!!");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await getAllusers();
        setUserList(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filterUser = userList.filter((user) => {
        return user.username.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilterUsers(filterUser);
      setIsSearchOpen(true);
    } else {
      setFilterUsers([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, userList]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(true);
  };

  const handleUserClick = async (userId) => {
    try {
      setLoading(false);
      setIsSearchOpen(false);
      setSearchQuery("");
      await router.push(`userProfile/${userId}`)
    } catch (error) {
      console.log(error);
      
    }finally {
      setLoading(false);
    }
  };

  const handleSearchClose = (e) => {
    if(!searchRef.current?.contains(e.target)) {
      setIsSearchOpen(false);

    }
  };

  useEffect(() => {
    document.addEventListener("click", handleSearchClose);

    return () => {
      document.removeEventListener("click", handleSearchClose);
    }

  });

  if (loading) return <Loader />

  return (
    <header className="bg-white dark:bg-[rgb(36,37,38)] text-foreground shadow-md h-16 fixed top-0 left-0 right-0 z-50 p-2">
      <div className="mx-auto flex justify-between items-center p-2">
        <div className="flex items-center gap-2 md:gap-4">
          <Image
            src="/images/Facebook_Logo.png"
            width={40}
            height={40}
            alt="facebook_logo"
            onClick={() => handleNavigation("/")}
            className="cursor-pointer"
          />

          <div className="relative " ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative ">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-8 w-40 md:w-64 h-10 bg-gray-100 dark:bg-[rgb(58,59,60)] rounded-full "
                  placeholder="Search facebook.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                />
              </div>

              {isSearchOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 z-50">
                  <div className="p-2 ">
                    {filterUsers.length > 0 ? (
                      filterUsers.map((user) => (
                        <div className="flex items-center space-x-8 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer" key={user._id} onClick={() => handleUserClick(user._id)}>
                          <Search className="absolute text-sm text-gray-400" />

                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {user?.profilePicture ? (
                                <AvatarImage
                                  src={user?.profilePicture}
                                  alt={user?.username}
                                />
                              ) : (
                                <AvatarFallback>
                                  {userPlaceholder}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span>{user?.username}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        {" "}
                        <div className="flex items-center dark:text-gray-200 truncate">
                          <Ban className="w-8 h-8 mr-2" />{" "}
                          <span>User not found...</span>
                        </div>{" "}
                      </>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        <nav className="hidden md:flex justify-around w-[40%] max-w-md">
          {[
            { icon: Home, path: "/", name: "home" },
            { icon: Video, path: "/videos", name: "video" },
            { icon: User, path: "/friends-list", name: "friends" },
          ].map(({ icon: Icon, path, name }) => (
            <Button
              className={`relative text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-transparent ${active === name ? "dark:text-blue-600 text-blue-600" : ""}`}
              key={name}
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation(path, name)}
            >
              <Icon />
            </Button>
          ))}
        </nav>

        {/* THERE ARE STARED USER PROFILE MENU */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            className={`md:hidden text-gray-600 cursor-pointer`}
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <Menu />
          </Button>

          <Button
            className={`md:block hidden pl-1 text-gray-600 cursor-pointer`}
            variant="ghost"
            size="icon"
          >
            <Bell />
          </Button>

          <Button
            className={`md:block hidden pl-1 text-gray-600 cursor-pointer`}
            variant="ghost"
            size="icon"
          >
            <MessageCircle />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={`relative h-8 w-8 rounded-full `}
                variant="ghost"
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
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 z-50" align="end">
              <DropdownMenuLabel className="font-normal ">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      {user?.profilePicture ? (
                        <AvatarImage
                          src={user?.profilePicture}
                          alt={user?.username}
                        />
                      ) : (
                        <AvatarFallback>{userPlaceholder}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="cursor-pointer">
                      <p className="text-sm font-medium leading-none">
                        {user?.username}
                      </p>

                      <p className="text-xs mt-2 text-gray-600 font-medium leading-none">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleNavigation(`/userProfile/${user?._id}`)}
              >
                <Users /> <span className="ml-2">Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <MessageCircle /> <span className="ml-2">Messages</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="cursor-pointer"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="mr-2" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="mr-2" />
                    <span>Light Mode</span>
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut /> <span className="ml-2">LogOut</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;
