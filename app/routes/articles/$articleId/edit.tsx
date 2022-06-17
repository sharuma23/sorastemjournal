import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunction, json, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import Tiptap from "~/components/Tiptap";
import { useState } from "react";
import { prisma } from "~/db.server";
import banana from 'public/defaultbanana.png';
import invariant from "tiny-invariant";

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

function validatePassword(oldPassword: string, inputedPassword: string): string {
  if (oldPassword === inputedPassword) {
    return "passed";
  }
  return "Invalid password."
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

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.articleId, "expected articleId");
  const articleToBeEdited = await prisma.article.findUnique({
    where: {
      id: params.articleId
    }
  });

  return articleToBeEdited as ArticleData;
}

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.articleId, "expected articleId");

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  console.log(values['article-title']);

  //validation
  const errors = {
    title: validate(values['article-title'], 5, 'Title must be at least 5 characters long'),
    body: validate(values['article-body'], 5, 'Body must be at least 5 characters long'),
    passwordHash: validatePassword(values['oldPassword'] as string, values['password'] as string),
    profilePhoto: validateImage(values['profilePhoto']),
    profileName: validate(values['name'], 3, 'Name must be at least 3 characters long'),
    profileBio: validate(values['profileBio'], 5, 'Bio must be at least 5 characters long')
  }

  if (values._method === 'delete' && errors.passwordHash === 'passed') {
    await prisma.article.delete({
      where: {
        id: params.articleId
      }
    })

    return redirect('/articles')
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
  await prisma.article.update({
    where: {
      id: params.articleId
    },
    data: newArticleData
  });

  return redirect(`/articles/${params.articleId}`);
};

export default function EditArticle() {
  const oldArticle = useLoaderData() as ArticleData;

  const [editorOutput, setEditorOutput] = useState<string>(oldArticle.body);
  const [articleData, setArticleData] = useState<ArticleData>(oldArticle);

  const [password, setPassword] = useState<string>("");
  let actionData = useActionData();

  let validationErrors: ArticleData = {
    title: "passed",
    body: "passed",
    passwordHash: "passed",
    profilePhoto: "passed",
    profileName: "passed",
    profileBio: "passed"
  };

  if (actionData) {
    validationErrors.title = actionData.errors.title;
    validationErrors.body = actionData.errors.body;
    validationErrors.passwordHash = actionData.errors.passwordHash;
    validationErrors.profilePhoto = actionData.errors.profilePhoto;
    validationErrors.profileName = actionData.errors.profileName;
    validationErrors.profileBio = actionData.errors.profileBio;
  }


  return (
    <div className="articlePage">

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
          cols={30}
          value={articleData.title}
          minLength={5}
          maxLength={60}
          onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
        />
        {validationErrors.title !== 'passed' && (
          <span className="validation-error">{validationErrors.title !== 'passed' && validationErrors.title}</span>
        )}
        <textarea
          className="blurb"
          id="input"
          name="profile-bio"
          placeholder="Enter some background info here"
          rows={3}
          cols={75}
          value={articleData.profileBio}
          onChange={(e) => setArticleData({ ...articleData, profileBio: e.target.value })}
        />
        {validationErrors.profileBio !== 'passed' && (
          <span className="validation-error">{validationErrors.profileBio !== 'passed' && validationErrors.profileBio}</span>
        )}
        <ul className="author">
          <li><input
            type="text"
            name="name"
            min={3}
            className="c-article-identifiers__type"
            id="input"
            placeholder="Firstname Lastname"
            defaultValue={oldArticle.profileName}
            size={articleData.profileName.length < 20 ? 20 : articleData.profileName.length}
            onChange={(e) => setArticleData({ ...articleData, profileName: e.target.value })}
          /></li>
          {validationErrors.profileName !== 'passed' && (
            <span className="validation-error">{validationErrors.profileName !== 'passed' && validationErrors.profileName}</span>
        )}

          <li>
            <div>
              <button>
                <img src="https://img.icons8.com/external-justicon-lineal-color-justicon/344/external-email-office-stationery-justicon-lineal-color-justicon.png" />
                <a><span className="underlined"> {(articleData.profileName).replace(" ", ".")}@soraschools.com</span></a>
              </button>
            </div>
          </li>
        </ul>
        <input
          className="c-article-identifiers__item"
          id="linkPaste"
          type="url"
          name="image-link"
          placeholder="Paste a link to your image or gif here"
          size={109}
          defaultValue={oldArticle.profilePhoto ? oldArticle.profilePhoto : ""}
          onChange={(e) => {
            e.target.size = e.target.value.length;
            if (validateImage(e.target.value) !== 'passed') {
              setArticleData({ ...articleData, profilePhoto: banana })
              //add error span trigger
            } else {
              setArticleData({ ...articleData, profilePhoto: e.target.value })
            }
          }
          }
        />
        {validationErrors.profilePhoto !== 'passed' && (
            <span className="validation-error">{validationErrors.profilePhoto !== 'passed' && validationErrors.profilePhoto}</span>
        )}
        <img className="image" src={articleData.profilePhoto} height="800" />
        <Tiptap setOutput={setEditorOutput} viewOnly={false} passedContent={oldArticle.body} />
        {validationErrors.body !== 'passed' && (
            <span className="validation-error">{validationErrors.body !== 'passed' && validationErrors.body}</span>
        )}

        <div className="buttonSection" >
          <input
            className="c-article-identifiers__item"
            id="input"
            type="text"
            name="password"
            placeholder="Enter your password here to save changes"
            min={5}
            size={40}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <Form method="post">
            <input type="hidden" name="name" value={articleData.profileName} />
            <input type="hidden" name="article-title" value={articleData.title} />
            <input type="hidden" name="profileBio" value={articleData.profileBio} />
            <input type="hidden" name="article-body" value={editorOutput} />
            <input type="hidden" name="profilePhoto" value={articleData.profilePhoto} />
            <input type='hidden' name='oldPassword' value={oldArticle.passwordHash} />
            <input type='hidden' name='password' value={password} />
            <button className="submitButton" type="submit">Submit</button>
          </Form>

          <Form method="post">
            <input type="hidden" name="name" value={articleData.profileName} />
            <input type="hidden" name="article-title" value={articleData.title} />
            <input type="hidden" name="profileBio" value={articleData.profileBio} />
            <input type="hidden" name="article-body" value={editorOutput} />
            <input type="hidden" name="profilePhoto" value={articleData.profilePhoto} />
            <input type='hidden' name='oldPassword' value={oldArticle.passwordHash} />
            <input type='hidden' name='password' value={password} />
            <input type='hidden' name='_method' value='delete' />
            <button id="delete" className="submitButton" type="submit">Delete</button>
          </Form>
        </div>
        {validationErrors.passwordHash !== 'passed' && (
            <span className="validation-error">{validationErrors.passwordHash !== 'passed' && validationErrors.passwordHash}</span>
        )}
      </div>
    </div>

  )
}