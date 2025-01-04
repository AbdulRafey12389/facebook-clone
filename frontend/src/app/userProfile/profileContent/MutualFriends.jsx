import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserX } from "lucide-react";
import { postStore } from "@/store/postStore";
import { friendStore } from "@/store/userFriendsRequestStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function MutualFriends({ id, isOwner }) {
  const { mutualFriends, fetchMutualFriends, unFollowUser } = friendStore();
  const router = useRouter();

  useEffect(() => {
    fetchMutualFriends(id);
  }, [id, fetchMutualFriends]);

  const handleUnFollow = async (userId) => {
    await unFollowUser(userId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6 ">
          <h2 className="text-xl font-bold mb-4 dark:text-gray-200">
            Mutual friends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mutualFriends?.map((friend) => (
              <div
                key={friend?._id}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-start justify-between "
              >
                <div className="flex items-center space-x-4 ">
                  <Avatar
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(`/userProfile/${friend?._id}`);
                    }}
                  >
                    {friend?.profilePicture ? (
                      <AvatarImage
                        src={friend?.profilePicture}
                        alt={friend?.username}
                      />
                    ) : (
                      <AvatarFallback className="dark:bg-gray-400 ">
                        {friend?.username
                          ?.split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div
                    onClick={() => {
                      router.push(`/userProfile/${friend?._id}`);
                    }}
                  >
                    <p className="font-semibold cursor-pointer dark:text-gray-100">
                      {friend.username}
                    </p>
                    <p className="text-sm text-gray-400">{friend?.followerCount} followers</p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!isOwner}>
                      <MoreHorizontal className="h-4 w-4 dark:text-gray-200" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" onClick={ async () => {
                     await handleUnFollow(friend?._id);
                     await fetchMutualFriends(id);
                     toast.success(`You have unfollowed to ${friend?.username}`)
                  }}>
                    <DropdownMenuItem>
                      <UserX className="h-4 w-4 mr-2" /> Unfollow
                    </DropdownMenuItem>
                  </DropdownMenuContent>

                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default MutualFriends;
