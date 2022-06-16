import { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Article } from "@prisma/client";
import { Link } from "@remix-run/react";


export const loader: LoaderFunction = async () => {
  const articles: Article[] = await prisma.article.findMany();

  return articles;
}

export default function ArticleIndexPage() {
  const data = useLoaderData() as Article[];
  const articleList = data.map((article: Article) => 
    <li key={article.id}>
      <Link to={article.id}>{article.title}</Link>
    </li>
  )

  return (
    <ul>
      {articleList}
    </ul>
  )
}