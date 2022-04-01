/** @jsxImportSource @emotion/react */
import { Checkbox } from "@chakra-ui/react";
import { useEditor, useNode } from "@craftjs/core";
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
import { EditorContent, useEditor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "../../hooks/useDebounce";
import BackgroundColor from "../../RightSidebar/BackgroundColor";
import BorderSettings from "../../RightSidebar/BorderSettings";
import FontSettings from "../../RightSidebar/FontSettings";
import LinkSettings from "../../RightSidebar/LinkSettings";
import MarginSettings from "../../RightSidebar/MarginSettings";
import PaddingSettings from "../../RightSidebar/PaddingSettings";
import { SettingsContainer } from "../../RightSidebar/RightSidebar";
import {
  DEFAULT_COLOR,
  DEFAULT_COLOR_LINK,
  DEFAULT_VISITED_COLOR_LINK,
} from "../../utils/consts";
import MenuBar from "./MenuBar";

const Container = styled(motion.div)<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  a {
    cursor: pointer !important;
  }

  .ProseMirror {
    margin: 10px 10px 10px;
  }
  ${(props) =>
    props.selected &&
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
  border-radius: 5px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0px;
  font-family: Arial, Helvetica, sans-serif !important;
`;

interface Props {
  text: string;
  fontSize: number;
  fontColor: string;
  lineSpacing: number;
  fontFamily: string;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  borderWidth: number;
  borderRadius: number;
  borderStyle: string;
  borderColor: string;
  linkColor?: string;
  visitedLinkColor?: string;
  backgroundColor?: string;
  isCancelText?: boolean;
}

export const Text = ({
  text,
  fontSize,
  lineSpacing,
  fontColor,
  fontFamily,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  borderWidth,
  borderRadius,
  borderStyle,
  borderColor,
  backgroundColor,
  isCancelText,
  linkColor,
  visitedLinkColor,
}: Props) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
    id,
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  const { enabled } = useEditor((state, query) => ({
    enabled: state.options.enabled,
  }));

  const [isSelected, setIsSelected] = useState(false);

  const editor = TiptapEditor({
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
    editable: enabled,
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
          (prop: Record<string, any>) => (prop.text = editor?.getHTML()),
          1000
        );
      }
    }, 500),
    [editor]
  );

  useEffect(() => {
    if (selected) {
      return;
    }
    setIsSelected(false);
  }, [selected]);

  useEffect(() => {
    editor?.setEditable(enabled);
  }, [enabled]);

  if (!editor) return <></>;
  return (
    <Container
      id={isCancelText ? "cancel_button" : undefined}
      ref={(ref) => ref && connect(drag(ref))}
      onClick={() => selected && setIsSelected(true)}
      selected={selected}
      css={css`
        a {
          color: ${linkColor || DEFAULT_COLOR_LINK} !important;
          :visited {
            color: ${visitedLinkColor || DEFAULT_VISITED_COLOR_LINK} !important;
          }
        }
        font-size: ${fontSize}px;
        line-height: ${lineSpacing}em;
        color: ${fontColor};
        font-family: ${fontFamily};
        margin: ${marginTop}px ${marginRight}px ${marginBottom}px
          ${marginLeft}px;
        padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px
          ${paddingLeft}px;
        border-width: ${borderWidth}px;
        border-radius: ${borderRadius}px;
        border-color: ${borderColor};
        border-style: ${borderStyle};
        background-color: ${backgroundColor};
        ${isCancelText &&
        !enabled &&
        css`
          cursor: pointer;
        `}
      `}
    >
      {enabled && !isSelected && editor.isEmpty ? (
        // <motion.div layoutId={`editor-${id}`}>
        <Empty>Add text</Empty>
      ) : (
        // </motion.div>
        // <motion.div layoutId={`editor-${id}`}>
        <EditorContent editor={editor} />
        // </motion.div>
      )}
      {/* <motion.div layoutId={`editor-menu-${id}`}> */}
      {editor && isSelected && <MenuBar editor={editor} />}
      {/* </motion.div> */}
    </Container>
  );
};

const Settings = () => {
  const {
    actions: { setProp },
    ...props
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    fontColor: node.data.props.fontColor,
    lineSpacing: node.data.props.lineSpacing,
    fontFamily: node.data.props.fontFamily,
    marginTop: node.data.props.marginTop,
    marginBottom: node.data.props.marginBottom,
    marginLeft: node.data.props.marginLeft,
    marginRight: node.data.props.marginRight,
    paddingTop: node.data.props.paddingTop,
    paddingBottom: node.data.props.paddingBottom,
    paddingLeft: node.data.props.paddingLeft,
    paddingRight: node.data.props.paddingRight,
    borderWidth: node.data.props.borderWidth,
    borderRadius: node.data.props.borderRadius,
    borderStyle: node.data.props.borderStyle,
    borderColor: node.data.props.borderColor,
    backgroundColor: node.data.props.backgroundColor,
    isCancelText: node.data.props.isCancelText,
    linkColor: node.data.props.linkColor,
    visitedLinkColor: node.data.props.visitedLinkColor,
  }));

  return (
    <SettingsContainer>
      <BackgroundColor
        backgroundColor={props.backgroundColor}
        setValue={(value: string | undefined, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />
      <Checkbox
        m={5}
        size="lg"
        colorScheme="orange"
        defaultIsChecked={props.isCancelText}
        isChecked={props.isCancelText}
        onChange={(evt) => {
          setProp(
            (prop: Record<string, any>) =>
              (prop.isCancelText = evt.target.checked),
            1000
          );
        }}
      >
        Cancel Button
      </Checkbox>
      <MarginSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />

      <PaddingSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />

      <BorderSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />

      <FontSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />
      <LinkSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />
    </SettingsContainer>
  );
};

export const defaultTextProps = {
  text: "",
  fontSize: 14,
  fontColor: "#1A202C",
  lineSpacing: 1,
  fontFamily: "Source Sans Pro",
  marginTop: 0,
  marginBottom: 5,
  marginLeft: 0,
  marginRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  borderWidth: 0,
  borderRadius: 0,
  borderStyle: "none",
  borderColor: "#e2e8f0",
};

Text.craft = {
  props: defaultTextProps,
  related: {
    settings: Settings,
  },
};
