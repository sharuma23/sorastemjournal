import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {

  const hashedPassword = await bcrypt.hash("bananas", 10);

  await prisma.article.create({
    data: {
      title: "My first article",
      body: "this is a super cool article that i wrote xdxd",
      passwordHash: hashedPassword,
      profilePhoto: "https://www.html5rocks.com/static/images/tutorials/easy-hidpi/chrome1x.png",
      profileName: "Shivansh Sharma",
      profileBio: "this took way too long to make man"
    }
  });

  console.log(`Database has been seeded :D 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
