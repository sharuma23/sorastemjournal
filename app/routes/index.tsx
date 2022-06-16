import { Link } from "@remix-run/react";
import ProfileBubble from "~/components/profileBubble";
import { useState, useEffect } from "react";

export default function Index() {

  return (
    //sm:flex sm:items-center sm:justify-center
    <main className="relative min-h-screen bg-blue-400 flex">
      <ProfileBubble/>
      <ProfileBubble/>
      <ProfileBubble/>
      <ProfileBubble/>
      <ProfileBubble/>
      <ProfileBubble/>
      <ProfileBubble/>
      <ProfileBubble/>
      <ProfileBubble/>
      <ProfileBubble/>
      <ProfileBubble/>
      <ProfileBubble/>

    </main>
  );
}
