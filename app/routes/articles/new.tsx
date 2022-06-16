import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import Tiptap from "~/components/Tiptap";
import { useState } from "react";
import { prisma } from "~/db.server";



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
  return json(data, {status: 400});
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
    title: validate(values['article-title'], 5, 'Title must be at least 5 characters wrong'),
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
    return badRequest(({errors, newArticleData}));
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

  return (
    <div>
      <Form method="post" className="mx-60 my-40">
        <label className="font-bold text-5xl text-left py-2"> Your Name: </label>
        <input type="text" name="name" defaultValue="Super Cool Sora Student" />
        {actionData?.errors?.title && (
          <div className="text-red">{actionData.errors.title !== 'passed' && actionData.errors.title}</div>
        )}
        <br />
        <label>Article Title: </label>
        <input type="text" name="article-title" defaultValue="My Well-written Article" />

        <input type="hidden" name="article-body" defaultValue={editorOutput} />
        <br />
        <label> Password (in case you need to edit your article in the future): </label>
        <input type="text" name="password" defaultValue="Sora2022" />

        <button type="submit">Submit</button>
      </Form>
      <Tiptap setOutput={setEditorOutput} viewOnly={false} passedContent="This is the initial text that should be outputted on the editor." />
    </div>
  )
}