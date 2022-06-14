import type { User, Profile } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Profile } from "@prisma/client"

export function getProfile({
  userId
}: Pick<Profile, "userId"> & {
  userId: User["id"];
}) {
  return prisma.profile.findFirst({
    where: { userId },
  });
}