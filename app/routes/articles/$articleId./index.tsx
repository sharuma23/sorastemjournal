import type { Article } from "@prisma/client";
import { prisma } from "~/db.server";
import type { LoaderFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { useLoaderData } from "@remix-run/react";
import Tiptap from "~/components/Tiptap";

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
  const discordName: string = "";
  const discordTag: string = "0000";
  const instagramName: string = "";
  let coverPhoto: string = article.profilePhoto as string;
  if (!coverPhoto) {
    coverPhoto = "https://media.nature.com/lw800/magazine-assets/d41586-022-01613-2/d41586-022-01613-2_23159562.gif";
  }


  return (
    <div className="main">
      <ul className="c-article-identifiers">
        <li className="c-article-identifiers__item"><span className="c-article-identifiers__type">SORA SCHOOLS</span></li>
        <li className="c-article-identifiers__item"><time>{updatedAtDate.toDateString()}</time></li>
      </ul>
      <div className="title">{article.title}</div>
      <div className="blurb">{article.profileBio}</div>

      <ul className="author">
        <li><span className="c-article-identifiers__type">{article.profileName}</span></li>

        <li>
          <div>
            <button onClick={copyPasteFunction}>
              <img src="https://seeklogo.com/images/D/discord-logo-134E148657-seeklogo.com.png" />
              <a><span className="underlined">{discordName}</span><span className="no-underline">#</span><span className="underlined">{discordTag}</span></a>
            </button>
          </div>
        </li>
        <li>
          <div>
            <button onClick={copyPasteFunction}>
              <img src="https://cdn.discordapp.com/attachments/895795779439038464/986803876009246790/unknown.png" />
              <a><span className="no-underline">@</span><span className="underlined">{instagramName}</span></a>
            </button>
          </div>
        </li>
      </ul>

      <img className="image" src={coverPhoto} />
      <Tiptap setOutput={() => { }} viewOnly={true} passedContent={article.body} />
    </div>

  )
}