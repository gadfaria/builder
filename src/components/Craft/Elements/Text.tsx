/** @jsxImportSource @emotion/react */
import { useNode } from "@craftjs/core";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import FontFamily from "@tiptap/extension-font-family";
import TiptapLink from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapText from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import InputNumber from "../components/InputNumber";
import { debounce } from "../hooks/useDebounce";
import { DEFAULT_COLOR } from "../utils/consts";
import MenuBar from "./MenuBar";

const Container = styled(motion.div)<{ isSelected: boolean }>`
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

const Empty = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #fff2e5;
  color: ${DEFAULT_COLOR};
  border: 1px dashed ${DEFAULT_COLOR};
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0px;
  font-family: Arial, Helvetica, sans-serif !important;
`;

export const Text = ({ text, fontSize }: any) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
    id,
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  const [editable, setEditable] = useState(false);

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
      TiptapText,
      FontFamily,
      BulletList,
      TiptapLink,
    ],
    content: text,
    // editable: !isPreview,
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
      if (editor) {
        setProp(
          (props: Record<string, any>) => (props.text = editor?.getHTML())
        );
      }
    }, 500),
    [editor]
  );

  useEffect(() => {
    if (selected) {
      return;
    }
    setEditable(false);
  }, [selected]);

  if (!editor) return <></>;
  return (
    <Container
      ref={(ref) => ref && connect(drag(ref))}
      onClick={() => selected && setEditable(true)}
      isSelected={selected}
      css={css`
        font-size: ${fontSize}px;
      `}
    >
      {!editable && editor.isEmpty ? (
        <motion.div layoutId={`editor-${id}`}>
          <Empty>Add text</Empty>
        </motion.div>
      ) : (
        <motion.div layoutId={`editor-${id}`}>
          <EditorContent editor={editor} />
        </motion.div>
      )}
      <motion.div layoutId={`editor-menu-${id}`}>
        {editor && editable && <MenuBar editor={editor} />}
      </motion.div>
    </Container>
  );
};

const TextSettings = () => {
  const {
    actions: { setProp },
    fontSize,
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
  }));

  return (
    <>
      <InputNumber
        label="Font Size"
        value={fontSize || 14}
        handleValueChange={(vle) =>
          setProp((props: Record<string, any>) => (props.fontSize = vle), 1000)
        }
      />
    </>
  );
};

export const TextDefaultProps = {
  text: "",
  fontSize: 14,
};

Text.craft = {
  props: TextDefaultProps,
  related: {
    settings: TextSettings,
  },
};
