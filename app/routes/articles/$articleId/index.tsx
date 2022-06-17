import type { Article } from "@prisma/client";
import { prisma } from "~/db.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import Tiptap from "~/components/Tiptap";
import { FaEdit } from "react-icons/fa";
import { Link } from "@remix-run/react";

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
    throw new Response("Article not found D:", { status: 404 })
  }

  return article;
};

function copyPasteFunction(): void {
  return console.log("copy paste executed");
}

export default function Article() {
  const article = useLoaderData() as Article;
  const updatedAtDate: Date = new Date(article.updatedAt);
  const fakeEmail: string = `${(article.profileName!).replace(" ", "")}`;
  let coverPhoto: string = article.profilePhoto as string;
  if (!coverPhoto) {
    coverPhoto = "https://media.nature.com/lw800/magazine-assets/d41586-022-01613-2/d41586-022-01613-2_23159562.gif";
  }


  return (
    <div className="articlePage">
      <div className="main">
        <ul className="c-article-identifiers">
          <li className="c-article-identifiers__item"><span className="c-article-identifiers__type">SORA SCHOOLS</span></li>
          <li className="c-article-identifiers__item"><time>{updatedAtDate.toDateString()}</time></li>
        </ul>
        <div className="title">{article.title}</div>
        <div className="blurb">{article.profileBio}</div>

        <ul className="author">
          <li><span className="c-article-identifiers__item">{article.profileName}</span></li>

          <li>
            <div>
              <button onClick={copyPasteFunction}>
                <img src="https://img.icons8.com/external-justicon-lineal-color-justicon/344/external-email-office-stationery-justicon-lineal-color-justicon.png" />
                <a><span className="underlined">{fakeEmail}@soraschools.com</span></a>
              </button>
            </div>
          </li>

        </ul>

        <img className="image" src={coverPhoto} />
        <Tiptap setOutput={() => { }} viewOnly={true} passedContent={article.body} />
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Link to="edit"><FaEdit /></Link>
        </div>
      </div>
    </div>

  )
}