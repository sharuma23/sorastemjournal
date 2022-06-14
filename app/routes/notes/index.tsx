import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { requireUserId } from "~/session.server";
import { getProfile } from "~/models/profile.server";
import type { Profile } from "~/models/profile.server";
import { json, redirect } from "@remix-run/node";

type LoaderData = {
  profile: Profile
}

export const loader: LoaderFunction = async ({request, params}) => {
  const userId = await requireUserId(request);

  const profile = await getProfile({userId});
  if (!profile) {
    throw new Response("Not Found", { status: 404 });
  }
  
  return json<LoaderData>( { profile } );
}

export default function NoteIndexPage() {
  const loaderData = useLoaderData() as LoaderData;

  return (
    <p>
      please work god please: {loaderData.profile.bio}
      No note selected. Select a note on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new note.
      </Link>
    </p>
  );
}
