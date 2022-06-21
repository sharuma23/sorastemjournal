import { Form, useActionData, useParams } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import Tiptap from "~/components/Tiptap";
import { useState } from "react";
import { prisma } from "~/db.server";
import banana from 'public/defaultbanana.png';
import Card from "~/components/card";

function validate(input: any, minimumLength: number, errorMessage: string) {
  if (typeof input !== 'string' || input.length < minimumLength) {
    return errorMessage;
  }
  return 'passed';
}

function validateImage(imagelink: any): string {
  try {
    const pfpURL = new URL(imagelink);
  } catch {
    return "Invalid Image URL";
  }
  return "passed";
}

function badRequest(data: any): Response {
  return json(data, { status: 400 });
}

interface ArticleData {
  title: string,
  body: string,
  passwordHash: string,
  profilePhoto: string,
  profileName: string,
  profileBio: string
}

export const action: ActionFunction = async ({ request }) => {
  //grab form data
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  //validation
  const errors = {
    title: validate(values['article-title'], 5, 'Title must be at least 5 characters long'),
    body: validate(values['article-body'], 5, 'Body must be at least 5 characters long'),
    passwordHash: validate(values['password'], 5, 'Password must be at least 5 characters long'),
    profilePhoto: validateImage(values['profilePhoto']),
    profileName: validate(values['name'], 3, 'Name must be at least 3 characters long'),
    profileBio: validate(values['profileBio'], 5, 'Bio must be at least 5 characters long')
  }

  //create data object from the formData
  const newArticleData: ArticleData = {
    title: values['article-title'] as string,
    body: values['article-body'] as string,
    passwordHash: values['password'] as string,
    profilePhoto: values['profilePhoto'] as string,
    profileName: values['name'] as string,
    profileBio: values['profileBio'] as string
  }

  //if one of the fields did not pass through validation, returns a bad request
  if (Object.values(errors).some(element => element !== 'passed')) {
    return badRequest(({ errors, newArticleData }));
  }

  //make the article in the database
  await prisma.article.create({
    data: newArticleData
  });

  return redirect('/articles');
};

export default function NewArticle() {
  const [editorOutput, setEditorOutput] = useState<string>("No content");
  const actionData = useActionData();
  const [articleData, setArticleData] = useState<ArticleData>({
    title: "",
    body: "if this message comes up that means the tiptap content thing got fucked up lmao",
    passwordHash: "",
    profilePhoto: "",
    profileName: "",
    profileBio: ""
  });

  return (
    <div className="articlePage">
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#4a6592',
        padding: '20px'
      }}>
      </div>
      <div className="main">
        <ul className="c-article-identifiers">
          <li className="c-article-identifiers__item"><span className="c-article-identifiers__type">SORA SCHOOLS</span></li>
          <li className="c-article-identifiers__item"><time>{new Date().toDateString()}</time></li>
        </ul>
        <textarea
          className="title"
          id="input"
          name="article-title"
          placeholder="Enter your article title here (max 60 characters)"
          rows={3}
          value={articleData.title}
          minLength={5}
          maxLength={60}
          onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
        />
        {actionData?.errors?.title && (
          <span className="validation-error">{actionData.errors.title !== 'passed' && actionData.errors.title}</span>
        )}

        <textarea
          className="blurb"
          id="input"
          name="profile-bio"
          placeholder="Enter some background info here"
          rows={3}
          value={articleData.profileBio}
          minLength={5}
          onChange={(e) => setArticleData({ ...articleData, profileBio: e.target.value })}
        />
        {actionData?.errors?.profileBio && (
          <span className="validation-error">{actionData.errors.profileBio !== 'passed' && actionData.errors.profileBio}</span>
        )}

        <ul className="author">
          <li><input
            type="text"
            name="name"
            min={3}
            className="c-article-identifiers__item"
            id="input"
            placeholder="Firstname Lastname"
            size={articleData.profileName.length < 20 ? 20 : articleData.profileName.length}
            onChange={(e) => setArticleData({ ...articleData, profileName: e.target.value })}
          /></li>
          {actionData?.errors?.profileName && (
            <span className="validation-error">{actionData.errors.profileName !== 'passed' && actionData.errors.profileName}</span>
          )}
          <li>
            <div>
              <button>
                <img src="https://img.icons8.com/external-justicon-lineal-color-justicon/344/external-email-office-stationery-justicon-lineal-color-justicon.png" />
                <a><span className="underlined"> {(articleData.profileName).replace(" ", "")}@soraschools.com</span></a>
              </button>
            </div>
          </li>
        </ul>
        <input
          type="url"
          name="image-link"
          placeholder="Paste a link to your image or gif here"
          className="c-article-identifiers__item"
          id="linkPaste"
          onChange={(e) => {
            if (validateImage(e.target.value) !== 'passed') {
              setArticleData({ ...articleData, profilePhoto: banana })
              //add error span trigger
            } else {
              setArticleData({ ...articleData, profilePhoto: e.target.value })
            }
          }
          }
        />
        <img className="image" src={articleData.profilePhoto} height="800" />
        <Tiptap setOutput={setEditorOutput} viewOnly={false} passedContent="Copy and paste your article in here.<br><br><br>" />

        <Form method="post">
          <input type="hidden" name="name" value={articleData.profileName} />
          <input type="hidden" name="article-title" value={articleData.title} />
          <input type="hidden" name="profileBio" value={articleData.profileBio} />
          <input type="hidden" name="article-body" value={editorOutput} />
          <input type="hidden" name="profilePhoto" value={articleData.profilePhoto} />
          <div className="buttonSection">
            <input
              type="text"
              name="password"
              className="c-article-identifiers__item"
              id="input"
              placeholder="Enter a password here"
              min={5}
              size={articleData.passwordHash.length < 20 ? 20 : articleData.passwordHash.length}
              onChange={(e) => setArticleData({ ...articleData, passwordHash: e.target.value })}
              value={articleData.passwordHash}
            />
            <button className="submitButton" type="submit">Submit</button>
          </div>
        </Form>
        {actionData?.errors?.passwordHash && (
          <span className="validation-error">{actionData.errors.passwordHash !== 'passed' && actionData.errors.passwordHash}</span>
        )}
      </div>
    </div>

  )
}