/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
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
import { useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import React, { MouseEventHandler, useCallback, useRef } from "react";
import { isMobile, isMobileSafari } from "react-device-detect";
import { FaRegTrashAlt } from "react-icons/fa";
import { debounce } from "../../hooks/useDebounce";
import { indexesAtom, itemListAtom } from "./Builder";
import {
  DEFAULT_COLOR_LINK,
  DEFAULT_VISITED_COLOR_LINK,
} from "./BuilderConsts";
import { Container, Empty } from "./BuilderEditor";
import {
  ItemAction,
  ItemChildrenContainer,
  ItemRelative,
} from "./BuilderItem";
import BuilderEditorMenuBar from "./BuilderEditorMenuBar";

interface Props {
  isPreview: boolean;
  isSelected: boolean;
  index: number;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function BuilderFooter(props: Props) {
  const { isSelected, isPreview, onClick, index } = props;
  const [itemList, setItemsList] = useAtom(itemListAtom);
  const [item, setItem] = useAtom(itemList[index]);
  const setIndexes = useUpdateAtom(indexesAtom);

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
    onUpdate: () => {
      if (setEmailFunc.current) setEmailFunc.current();
    },
    editable: !isPreview,
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

  function handleDeleteClick() {
    const newItem = { ...item, deleted: true };
    setItem(newItem);
    setIndexes((indexes) => indexes.filter((i) => i !== index));
  }

  if (!editor) return null;
  return (
    <ItemRelative
      css={css`
        width: 100%;
        height: fit-content;

        ${!isPreview &&
        css`
          margin-bottom: 10px;
        `};

        ${isMobile &&
        isPreview &&
        css`
          padding-bottom: 50px;
        `}

        ${isMobileSafari &&
        isPreview &&
        css`
          padding-bottom: 105px;
        `}
      `}
    >
      <ItemChildrenContainer
        isText={true}
        onClick={onClick}
        isSelected={isSelected && !isPreview}
        isPreview={isPreview}
        css={css`
          border-radius: 0px;
          ${isPreview
            ? css`
                width: 100vw;
              `
            : css`
                width: 100%;
              `};
          a {
            color: ${item.style?.linkColor || DEFAULT_COLOR_LINK};
            :visited {
              color: ${item.style?.visitedLinkColor ||
              DEFAULT_VISITED_COLOR_LINK};
            }
          }
        `}
        style={{ ...item.style }}
      >
        <Container
          isSelected={isSelected}
          ref={ref}
          css={css`
            * {
              font-family: ${item.style?.fontFamily};
            }
            padding: 10px 0px;
            cursor: ${isPreview ? "default" : "auto"};
          `}
        >
          {!isSelected && !isPreview && editor.isEmpty ? (
            <Empty
              css={css`
                border-radius: 0px;
              `}
            >
              Add footer content
            </Empty>
          ) : (
            <>
              <EditorContent editor={editor} />
              {editor && isSelected && !isPreview && (
                <BuilderEditorMenuBar
                  editor={editor}
                  containerRef={ref?.current}
                />
              )}

              {isSelected && !isPreview && (
                <>
                  <ItemAction
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick();
                    }}
                    css={css`
                      top: -42px;
                      right: 10px;
                      cursor: pointer;
                      position: absolute;
                      z-index: 1;
                    `}
                  >
                    <FaRegTrashAlt />
                  </ItemAction>
                </>
              )}
            </>
          )}
        </Container>
      </ItemChildrenContainer>
    </ItemRelative>
  );
}
