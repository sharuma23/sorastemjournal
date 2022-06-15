import type { Article } from "@prisma/client";
import { prisma } from "~/db.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ params }) => {
  //typesafety
  invariant(params.articleId, "Expected params.articleId");
  
  //grab the article by the id
  const article = await prisma.article.findUnique({
    where: {
      id: params.articleId
    }
  });
  if (!article) {
    throw new Response("Article not found :(", { status: 404 })
  }

  return article;
};

export default function Article() {
  const article = useLoaderData() as Article;

  return (
    <div className="mx-60 my-40">
      <h1 className="font-bold text-5xl text-left py-2">{article.title}</h1>
      <h2 className="font-bold text-2xl text-left py-4">By {article.profileName}</h2>
    </div>
  )
}