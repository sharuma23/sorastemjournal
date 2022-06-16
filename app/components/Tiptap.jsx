import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {FaBold, FaItalic, FaHeading, FaParagraph, FaList, FaUndo, FaRedo} from 'react-icons/fa';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className= "toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'selected' : 'notselected'}
      >
        <FaBold/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'selected' : 'notselected'}
      >
        <FaItalic/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'selected' : 'notselected'}
      >
        <FaHeading/>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'selected' : 'notselected'}
      >
        <FaList/>
      </button>
      <button onClick={() => editor.chain().focus().undo().run()}
      className={editor.isActive('undo') ? 'selected' : 'notselected'}
      >
        <FaUndo/>
      </button>
      <button onClick={() => editor.chain().focus().redo().run()}
      className={editor.isActive('redo') ? 'selected' : 'notselected'}
      >
        <FaRedo/>
      </button>
    </div>
  )
}

//setOutputVar is a function to set the state of the editor's output and stored in a variable in the parent component
//viewOnly is a boolean. pretty self-explanatory
export default function Tiptap({ setOutput, viewOnly, passedContent}) {

  const editor = useEditor({
    //if viewOnly is true, that means editable is false (inverts value)
    editable: !viewOnly,
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "editor-paragraph"
          }
        }
      }),
      Image,
    ],
    content: passedContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setOutput(html);
    }
  });

  return (
    <>
      {!viewOnly ?
        <div>
          <MenuBar editor={editor} />
          <EditorContent editor={editor}/>
        </div>
        :
        <div className="main">
          <EditorContent editor={editor} />
        </div>
      }
    </>

  )
}
