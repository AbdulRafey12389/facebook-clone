import React, { useEffect, useState, useRef } from "react";
import PostContents from "./profileContent/PostContents";
import { Card, CardContent } from "@/components/ui/card";
import {
  Ban,
  Briefcase,
  Cake,
  GraduationCap,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Rss,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import MutualFriends from "./profileContent/MutualFriends";
import EditBio from "./profileContent/EditBio";
import { postStore } from "@/store/postStore";
import toast from "react-hot-toast";
import { formatDateOfTime } from "@/lib/utils";

function ProfileDetails({
  activeTab,
  profileData,
  setProfileData,
  isOwner,
  id,
  fetchProfile,
}) {
  const [isEditBio, setIsEditBio] = useState(false);

  const userPlaceholder = profileData?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const [ispostFormOpen, setIspostFormOpen] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());

  const {
    userPosts,
    story,
    fetchUserPost,
    fetchStory,
    handleCreatePost,
    handleLikePost,
    handleCommentPost,
    handlesharePost,
  } = postStore();
  

  useEffect(() => {
    if (id) {
      fetchUserPost(id);
    }
  }, [id, fetchUserPost]);

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
      await fetchUserPost();
    } catch (error) {
      console.log(error);
      toast.error("Failed to like or unlike post!!!");
    }
  };
  

  const tabContent = {
    posts: (
      <div className="flex flex-col lg:flex-row gap-6 ">
        <div className="w-full lg:w-[70%] space-y-6 ">
          {userPosts?.map((post) => (
            <PostContents
              key={post._id}
              posts={post}
              postId={post._id}
              userId={id}
              isOwner={isOwner}
              isliked={likePosts.has(post?._id)}
              onLike={() => handleLike(post?._id)}
              onComment={async (comment) => {
                await handleCommentPost(post?._id, comment),
                  await fetchUserPost(id);
              }}
              onShare={async () => {
                await handlesharePost(post?._id);
                await fetchUserPost(id);
              }}
            />
          ))}
        </div>

        <div className="w-full lg:w-[30%]">
          <Card>
            <CardContent className="p-6 ">
              <h2 className="text-xl font-bold mb-1 dark:text-gray-200">
                Intro
              </h2>

              {profileData?.bio && (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2 font-semibold">
                    {profileData?.bio?.bioText}
                  </p>
                  <div className="space-y-2 mb-4 dark:text-gray-200">
                    <div className="flex items-center">
                      <Home className="w-5 mr-2" />{" "}
                      <span>{profileData?.bio?.liveIn}</span>
                    </div>

                    <div className="flex items-center">
                      <Heart className="w-5 mr-2" />{" "}
                      <span>{profileData?.bio?.relationShip}</span>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="w-5 mr-2" />{" "}
                      <span>{profileData?.bio?.hometown}</span>
                    </div>

                    <div className="flex items-center">
                      <Briefcase className="w-5 mr-2" />{" "}
                      <span>{profileData?.bio?.workplace}</span>
                    </div>

                    <div className="flex items-center">
                      <GraduationCap className="w-5 mr-2" />{" "}
                      <span>{profileData?.bio?.education}</span>
                    </div>

                    <div className="flex items-center mb-4 dark:text-gray-200">
                      <Rss className="w-5 h-5 mr-2" />{" "}
                      <span>
                        Followed by {profileData?.followingCount} poeple
                      </span>
                    </div>

                    <div className="flex items-center mb-4 dark:text-gray-200">
                      <Phone className="w-5 h-5 mr-2" />{" "}
                      <span>{profileData?.bio?.phone}</span>
                    </div>
                  </div>

                  {isOwner && (
                    <Button
                      className="w-full"
                      onClick={() => setIsEditBio(true)}
                    >
                      Edit Bio
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    ),

    about: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-6 ">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-200 transform-cpu">
              About {profileData?.username}
            </h2>

            {profileData?.bio ? (
              <div className="space-y-4 dark:text-gray-200 transform-cpu">
                <div className="flex items-center">
                  <Briefcase className="w-5 mr-2" />{" "}
                  <span className="transform-cpu">
                    {profileData?.bio?.workplace}
                  </span>
                </div>

                <div className="flex items-center">
                  <GraduationCap className="w-5 mr-2" />{" "}
                  <span>{profileData?.bio?.education}</span>
                </div>

                <div className="flex items-center">
                  <Home className="w-5 mr-2" />{" "}
                  <span>{profileData?.bio?.liveIn}</span>
                </div>

                <div className="flex items-center">
                  <Heart className="w-5 mr-2" />{" "}
                  <span>{profileData?.bio?.relationShip}</span>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-5 mr-2" />{" "}
                  <span>{profileData?.bio?.hometown}</span>
                </div>

                <div className="flex items-center mb-4 dark:text-gray-200">
                  <Mail className="w-5 h-5 mr-2" />{" "}
                  <span>{profileData?.email}</span>
                </div>

                <div className="flex items-center mb-4 dark:text-gray-200">
                  <Phone className="w-5 h-5 mr-2" />{" "}
                  <span>{profileData?.bio?.phone}</span>
                </div>

                <div className="flex items-center mb-4 dark:text-gray-200">
                  <Cake className="w-5 h-5 mr-2" />{" "}
                  <span>
                    Birthday: {formatDateOfTime(profileData?.dateOfBirth)}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-4 dark:text-gray-200">
                  <Ban className="w-22 h-22 mr-2" />{" "}
                  <span>Here is no information added yet...</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    ),

    friends: <MutualFriends id={id} isOwner={isOwner} />,

    photos: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>

          <CardContent className="p-6 ">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-200">Photo</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userPosts
                ?.filter(
                  (post) => post?.mediaType === "image" && post?.mediaUrl
                )
                .map((post) => (
                  <img
                    key={post._id}
                    src={post?.mediaUrl}
                    alt={post.content}
                    className="w-[200px] h-[150px] object-cover rounded-lg"
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
  };

  return (
    <div className="mb-4">
      {tabContent[activeTab] || null}
      <EditBio
        isOpen={isEditBio}
        onClose={() => setIsEditBio(false)}
        fetchProfile={fetchProfile}
        initialData={profileData?.bio}
        id={id}
      ></EditBio>
    </div>
  );
}

export default ProfileDetails;
