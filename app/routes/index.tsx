import { Link } from "@remix-run/react";
import ProfileBubble from "~/components/profileBubble";

export default function Index() {
  return (
    <main className="relative min-h-screen bg-blue-400 sm:flex sm:items-center sm:justify-center">
      <ProfileBubble/>

    </main>
  );
}
