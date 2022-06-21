import { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Article } from "@prisma/client";
import banana from 'public/defaultbanana.png'
import Card from "~/components/card";

export const loader: LoaderFunction = async () => {
  const articles: Article[] = await prisma.article.findMany();

  return articles;
}

export default function ArticleIndexPage() {
  const data = useLoaderData() as Article[];


  const articleList = data.map((article: Article) => {
    const cardSize = Math.floor(Math.random() * 2);

    return (
      <Card
        key={article.id}
        imageLink={article.profilePhoto ? article.profilePhoto : banana}
        name={article.profileName ? article.profileName : "No Name"}
        title={article.title}
        blurb={article.profileBio ? article.profileBio : "No biography"}
        id={article.id}
        cardSize={cardSize === 0 ? 'tall' : 'wide'}
        imageDirection="left"
      />
    )
  }
  )

  return (
    <>
      <div className="indexPage">
        <div className="wrapper">
          {articleList}
        </div>
      </div>
    </>
  )
}