"use client";

import React, { useEffect, useState } from "react";
import ProfileHeader from "../ProfileHeader";
import ProfileTabs from "../ProfileTabs";
import { useParams } from "next/navigation";
import { fetchUserProfile } from "@/services/user.service";

function Page() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await fetchUserProfile(id);
      setProfileData(result.profile);
      setIsOwner(result.isOwner);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (!profileData) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <ProfileHeader
        profileData={profileData}
        setProfileData={setProfileData}
        isOwner={isOwner}
        id={id}
        fetchProfile={fetchProfile}
      />
      
      <ProfileTabs
        profileData={profileData}
        setProfileData={setProfileData}
        isOwner={isOwner}
        id={id}
        fetchProfile={fetchProfile}
      />
    </div>
  );
}

export default Page;
