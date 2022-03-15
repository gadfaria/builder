/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAtom } from "jotai";
import React, { useCallback, useRef } from "react";
import { debounce } from "../../hooks/useDebounce";
import { formBuilderCheckboxAtom } from "./Builder";
import { Empty } from "./BuilderEditor";
import StyledCheckBox from "../StyledCheckBox";

const Container = styled.div`
  width: 100%;
  display: flex;
  margin: 0px 5px;
`;

const EditorContainer = styled.div<{ isPreview: boolean; isSelected: boolean }>`
  height: 100%;
  width: 100%;
  margin-left: 5px;
  margin-top: -2px;

  pointer-events: ${(props) => (props.isPreview ? "none" : "auto")};

  p {
    padding: 0px;
    margin: 0px;
  }

  ${(props) =>
    props.isSelected &&
    css`
      .ProseMirror p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        letter-spacing: 0px;
        color: #979797;
        pointer-events: none;
        font-size: 15px;
        height: 0;
        font-family: Arial, Helvetica, sans-serif !important;
      }
    `};
`;

export default function BuilderCheckbox(props: any): JSX.Element {
  const { item, setItem, isPreview, isSelected } = props;
  const [checkbox, setCheckbox] = useAtom(formBuilderCheckboxAtom);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Text,
      FontFamily,
      Placeholder.configure({
        showOnlyWhenEditable: true,
        placeholder: "Enter checkbox text",
      }),
    ],
    content: item.state,
    onUpdate: () => {
      if (setEmailFunc.current) setEmailFunc.current();
    },
  });

  let setEmailFunc = useRef<() => void | null>(null);
  (setEmailFunc as any).current = useCallback(
    debounce(() => {
      if (editor)
        setItem((s: any) => ({
          ...s,
          state: editor?.getHTML(),
        }));
    }, 500),
    [editor]
  );

  if (!editor) return <></>;
  return (
    <Container
      css={css`
        * {
          font-family: ${item.style?.fontFamily};
        }
      `}
      onClick={() => !isPreview && editor.commands.focus()}
    >
      {!isSelected && !isPreview && editor.isEmpty ? (
        <Empty>Add checkbox text</Empty>
      ) : (
        <div
          css={css`
            display: flex;
            padding: 13px 0px;
          `}
        >
          <div
            css={css`
              z-index: 10;
              margin-top: -4px;
              > div {
                width: 1.2em;
                height: 1.2em;

                img {
                  width: 0.75em !important;
                }
              }
            `}
          >
            <StyledCheckBox
              check={!!checkbox}
              color={item.style?.checkboxColor}
              // @ts-ignore
              handleCheck={() => setCheckbox(!checkbox)}
            />
          </div>
          <EditorContainer
            isSelected={isSelected}
            isPreview={isPreview}
            onClick={() => !isPreview && editor.commands.focus()}
          >
            <EditorContent editor={editor} />
          </EditorContainer>
        </div>
      )}
    </Container>
  );
}
