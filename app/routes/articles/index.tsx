import { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Article } from "@prisma/client";
import banana from 'public/defaultbanana.png'
import Card from "~/components/card";
import Profile from "~/components/card";

export const loader: LoaderFunction = async () => {
  const articles: Article[] = await prisma.article.findMany();

  return articles;
}

export default function ArticleIndexPage() {
  const data = useLoaderData() as Article[];
  const numberOfArticles = data.length;
  const divisor = numberOfArticles/4;
  
  const articleList = data.map((article: Article) =>
      <Card
        key={article.id}
        imageLink={article.profilePhoto ? article.profilePhoto : banana}
        name={article.profileName ? article.profileName : "No Name"}
        title={article.title}
        blurb={article.profileBio ? article.profileBio : "No biography"}
        clickable={true}
        id={article.id}
      />
      
  )

  return (
    <>
      <div className="indexPage">
        <div id="wrapper">
          <div className="row">
            {articleList}
            {articleList}
          </div>
          <div className="row">
            {articleList}
            {articleList}
          </div>
          <div className="row">
            {articleList}
            {articleList}
          </div>
          <div className="row">
            {articleList}
            {articleList}
          </div>
        </div>
      </div>
    </>
  )
}