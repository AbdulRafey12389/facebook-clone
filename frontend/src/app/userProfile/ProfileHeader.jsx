"use client";

import { Button } from "@/components/ui/button";
import { Camera, PenLine, Save, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserCoverPhoto, updateUserProfile } from "@/services/user.service";
import userStore from "@/store/userStore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function ProfileHeader({
  profileData,
  setProfileData,
  isOwner,
  id,
  fetchProfile,
}) {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isEditCover, setIsEditCover] = useState(false);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = userStore();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      username: profileData?.username,
      dateOfBirth: profileData?.dateOfBirth?.split("T")[0],
      gender: profileData?.gender

    }
  })


  const profileImageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  const onSubmitProfile = async (data) => {
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender);
      

      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }
      
      const updateProfile = await updateUserProfile(id, formData);

      setProfileData({ ...profileData, ...updateProfile });
      setIsEditProfile(false);
      setProfilePicturePreview(null);
      setProfilePictureFile(null);
      setUser(updateProfile);
      await fetchProfile();
      toast.success("profile updated successfully ");

    } catch (error) {
      console.log("error updating profile...", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(previewUrl);
    }
  };

  const onSubmitCover = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      if (coverPhotoFile) {
        formData.append("coverPhoto", coverPhotoFile);
      }

      const updateProfile = await updateUserCoverPhoto(id, formData);

      setProfileData({ ...profileData, coverPhoto: updateProfile.coverPhoto });
      setIsEditCover(false);
      setCoverPhotoFile(null);
      setCoverPhotoPreview(null);
      toast.success("Cover photo change successfully ");
    } catch (error) {
      console.log("error updating user cover photo...", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverPhotoPreview(previewUrl);
    }
  };

  const userPlaceholder = profileData?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <div className="relative">
      <div className="relative h-64 md:h-80 bg-gray-300 overflow-hidden">
        <img
          src={profileData?.coverPhoto}
          alt="cover"
          className="w-full h-full object-cover"
        />

        {isOwner && (
          <Button
            className="absolute bottom-4 right-4 flex items-center cursor-pointer z-50"
            variant="secondary"
            size="sm"
            onClick={() => setIsEditCover(true)}
          >
            <Camera className="mr-0 md:mr-2 h-4 w-4 " />
            <span className="hidden md:block ">Edit Cover Photo</span>
          </Button>
        )}
      </div>

      {/* profile Section started here */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 ">
        <div className="flex flex-col md:flex-row items-center md:items-end md:space-x-5">
          <Avatar className="w-32 h-32 border-4 dark:border-black border-white">
            <AvatarImage
              src={profileData?.profilePicture}
              alt={profileData?.username}
            />
            <AvatarFallback className="dark:bg-gray-400">
              {userPlaceholder}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 md:mt-0 text-center md:text-left flex-grow ">
            <h1 className="text-3xl font-bold ">{profileData.username}</h1>
            <p className="text-gray-400 font-semibold">
              {profileData.followerCount} friends
            </p>
          </div>

          {isOwner && (
            <Button
              className="mt-4 md:mt-0 cursor-pointer"
              onClick={() => setIsEditProfile(true)}
            >
              <PenLine className="w-4 h-4 mr-2 " /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* EDIT PROFILE MODEL */}
      <AnimatePresence>
        {isEditProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className=" bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold  text-gray-900 dark:text-gray-100 ">
                  Edit profile
                </h2>

                <Button
                  variant="ghost"
                  size="icon"
                  className=""
                  onClick={() => setIsEditProfile(false)}
                >
                  <X className="" />
                </Button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmitProfile)}>
                <div className="flex flex-col items-center mb-4 ">
                  <Avatar className="w-24 h-24 border-4 dark:border-black border-white">
                    <AvatarImage src={profilePicturePreview || profileData.profilePicture} alt={profileData?.username} />
                    <AvatarFallback className="dark:bg-gray-400">
                      { userPlaceholder }
                    </AvatarFallback>
                  </Avatar>

                  <input type="file" accept="image/*" className="hidden" ref={profileImageInputRef} onChange={handleProfilePictureChange} />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={ () => profileImageInputRef.current?.click() }
                  >
                    <Upload className="h-4 w-4 mr-2 " /> Change profile picture
                  </Button>
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" {...register("username")} />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => setValue("gender", value)} defaultOpen={profileData?.gender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender " />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-400 text-white"
                >
                  <Save className="w-4 h-4 mr-2" /> { loading ? "Saving..." : "Save Changes" }
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT COVER MODEL */}
      <AnimatePresence>
        {isEditCover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className=" bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold  text-gray-900 dark:text-gray-100 ">
                  Edit Cover Photo
                </h2>

                <Button
                  variant="ghost"
                  size="icon"
                  className=""
                  onClick={() => setIsEditCover(false)}
                >
                  <X className="" />
                </Button>
              </div>

              <form className="space-y-4">
                <div className="flex flex-col items-center mb-4 ">
                  {coverPhotoPreview && (
                    <img
                      src={coverPhotoPreview}
                      alt="cover_photo"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}

                  <input type="file" accept="image/*" className="hidden" ref={coverImageInputRef} onChange={handleCoverPhotoChange} />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => coverImageInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2 " /> Select new cover photo
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-400 text-white"
                  onClick={onSubmitCover}
                  disabled={!coverPhotoFile}
                >
                  <Save className="w-4 h-4 mr-2" /> { loading ? "Saving..." : "Save cover photo" }
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileHeader;
