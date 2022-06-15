import { Form, useActionData } from "@remix-run/react";
import { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import Tiptap from "~/components/Tiptap";
import { useState } from "react";

export const action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let values = Object.fromEntries(formData)

  return redirect('/articles');
};

export default function NewArticle() {
  const [editorOutput, setEditorOutput] = useState<string>("No content");

  return (
    <div>
      <Form method="post" className="mx-60 my-40">
        <label> Your Name: </label>
        <input type="text" name="name" defaultValue="Super Cool Sora Student" />
        <br />
        <label>Article Title: </label>
        <input type="text" name="article-title" defaultValue="My Well-written Article" />

        <Tiptap setOutput={setEditorOutput} viewOnly={false} passedContent="This is the initial text that should be outputted on the editor." />
        <input type="hidden" name="article-body" defaultValue={editorOutput}/>
        <br />
        <label> Password (in case you need to edit your article in the future): </label>
        <input type="text" name="password" defaultValue="Sora2022" />

        <button type="submit">Submit</button>
      </Form>
    </div>
  )
}