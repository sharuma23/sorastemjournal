import { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { getProfile } from "~/models/profile.server";
import type { Profile } from "~/models/profile.server";
import { json, redirect } from "@remix-run/node";
 

type LoaderData = {
  profile: Profile
}

export const loader: LoaderFunction = async ({params, request}) => {
  const userId = await requireUserId(request);
  
  const profile = await getProfile({userId});
  if (!profile) {
    throw new Response('Profile data missing', {status:404});
  }

  return json<LoaderData>({profile});
}

export default function AccountIndexPage() {
  const loaderData = useLoaderData() as LoaderData;
  
  return (
    <div className=""></div>
  )
}