import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { Button } from "@/components/ui/button";
import { UserMinus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

function FriendsSuggestion({ friend, loading, onAction }) {

  const userPlaceholder = friend?.username?.split(" ").map((name) => name[0]).join("");
  const router = useRouter();
  
  

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 p-4 mr-4 mb-4 shadow rounded-lg"
      >
        <Avatar className="h-32 w-32 rounded mx-auto mb-4 cursor-pointer" onClick={() => {router.push(`/userProfile/${friend?._id}`)}}>
          {friend?.profilePicture ? (
            <AvatarImage src={friend?.profilePicture} alt={friend?.username} />
          ) : (
            <AvatarFallback className="dark:bg-gray-400 ">
              {userPlaceholder}
            </AvatarFallback>
          )}
        </Avatar>
        <h3 className="text-lg font-semibold text-center mb-4">
          {friend.username}
        </h3>

        <div className="flex flex-col justify-between">
          <Button className=" bg-blue-500" size="lg" onClick={() =>  onAction("add-friend", friend?._id)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add friend
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FriendsSuggestion;
