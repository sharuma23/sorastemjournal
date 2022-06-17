import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Gapcursor from '@tiptap/extension-gapcursor';
import Placeholder from '@tiptap/extension-placeholder';

//setOutputVar is a function to set the state of the editor's output and stored in a variable in the parent component
//viewOnly is a boolean. pretty self-explanatory
export default function Tiptap({ setOutput, viewOnly, passedContent }) {

  const editor = useEditor({
    //if viewOnly is true, that means editable is false (inverts value)
    editable: !viewOnly,
    editorProps: {
      attributes: {
        id: `${viewOnly && 'viewOnly'}`
      },
    },
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "body",
            id: "editor"
          }
        },
        heading: {
          HTMLAttributes: {
            class: "title",
            id: "editor"
          }
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: "image",
          id: "editor"
        }
      }),
      Gapcursor,
      Placeholder.configure({
        placeholder: "You can type your article in here..."
      })
    ],
    content: passedContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setOutput(html);
    }
  });

  return (<EditorContent editor={editor} />);
}
