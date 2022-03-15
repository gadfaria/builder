/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import { SetStateAction } from "jotai";
import React, { useCallback, useRef } from "react";
import { debounce } from "../../hooks/useDebounce";
import { ItemType } from "./Builder";
import BuilderEditorMenuBar from "./BuilderEditorMenuBar";

export const Container = styled(motion.div)<{ isSelected: boolean }>`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  a {
    cursor: pointer !important;
  }

  .ProseMirror {
    margin: 10px 10px 10px;
  }
  ${(props) =>
    props.isSelected &&
    css`
      min-height: 135px;

      .ProseMirror p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: #979797;
        font-weight: bold;
        pointer-events: none;
        height: 0;
        font-family: Arial, Helvetica, sans-serif !important;
      }
    `};
`;

export const Empty = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #fff2e5;
  color: #fb972e;
  border: 1px dashed #fb972e;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0px;
  font-family: Arial, Helvetica, sans-serif !important;
`;

interface Props {
  item: ItemType;
  setItem: (update: SetStateAction<ItemType>) => void;
  isSelected?: boolean;
  isPreview?: boolean;
}

export default function BuilderEditor(props: Props) {
  const { isSelected, item, setItem, isPreview } = props;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            style: "line-height: 1.4; margin: 0px;",
          },
        },
        bold: {
          HTMLAttributes: {
            style: "font-size: inherit;",
          },
        },
        italic: {
          HTMLAttributes: {
            style: "font-size: inherit;",
          },
        },
        listItem: {
          HTMLAttributes: {
            style: "margin: 15px 0px;",
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Enter content…",
      }),
      Underline.configure({
        HTMLAttributes: { style: "font-size: inherit;" },
      }),
      Document,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Paragraph.configure({
        HTMLAttributes: {
          style: "margin: 0px",
        },
      }),
      Text,
      FontFamily,
      BulletList,
      Link,
    ],
    content: item.state,
    editable: !isPreview,
    onUpdate: () => {
      if (setEmailFunc.current) setEmailFunc.current();
    },
    parseOptions: {
      preserveWhitespace: "full",
    },
  });

  const setEmailFunc = useRef<() => void | null>(null);
  (setEmailFunc as any).current = useCallback(
    debounce(() => {
      if (editor)
        setItem((s) => ({
          ...s,
          state: editor?.getHTML(),
        }));
    }, 500),
    [editor]
  );

  const ref = useRef(null);

  if (!editor) return null;
  if (editor?.isEmpty && isPreview) return null;
  return (
    <Container
      isSelected={!!isSelected}
      ref={ref}
      onClick={() => !isPreview && editor.commands.focus()}
      css={css`
        * {
          font-family: ${item.style?.fontFamily};
          ${item.style?.fontFamily === "Maven Pro" &&
          css`
            font-weight: 900;
          `}
        }
        cursor: ${isPreview ? "default" : "auto"};
      `}
    >
      {!isSelected && !isPreview && editor.isEmpty ? (
        <motion.div layoutId={`editor-${item.id}`}>
          <Empty>Add text</Empty>
        </motion.div>
      ) : (
        <motion.div layoutId={`editor-${item.id}`}>
          <EditorContent editor={editor} />
        </motion.div>
      )}
      <motion.div layoutId={`editor-menu-${item.id}`}>
        {editor && isSelected && (
          <BuilderEditorMenuBar editor={editor} containerRef={ref?.current} />
        )}
      </motion.div>
    </Container>
  );
}
