/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ChainedCommands, Editor } from "@tiptap/react";
import React, { useRef } from "react";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaHeading,
  FaItalic,
  FaLink,
  FaStrikethrough,
  FaUnderline,
  FaUnlink,
} from "react-icons/fa";
import { DEFAULT_COLOR } from "./BuilderConsts";

interface Props {
  editor: Editor;
  containerRef: HTMLDivElement | null;
}

const Container = styled.div`
  margin: 10px;
  font-size: 16px !important;
  line-height: normal !important;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  flex-direction: row;
  background-color: ${DEFAULT_COLOR};
  border-radius: 4px;

  font-family: Arial, Helvetica, sans-serif !important;
`;

const Button = styled.div<{ isActive?: boolean }>`
  border: none;
  padding: 10px;
  margin: 0px 5px;
  background-color: transparent;
  cursor: pointer;
  transition: opacity 0.3s;

  :hover {
    opacity: 1;
  }
  ${(props) =>
    props.isActive
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 1;
        `}
`;

const ModalContainer = styled.div`
  min-width: 400px;
  width: 100%;

  padding: 64px 16px 0;

  display: flex;
  flex-direction: column;

  input {
    margin-bottom: 48px;
  }
`;

const ButtonsWrapperModal = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: end;
  grid-gap: 16px;
`;

export default function BuilderEditorMenuBar(props: Props) {
  const linkURL = useRef<string>("");

  if (!props.editor || !props.containerRef) {
    return null;
  }

  function editorChainKeepAlign(editor: Editor, chain: ChainedCommands) {
    // Heading resets alignment, so I need to do that too
    if (editor.isActive({ textAlign: "left" })) chain.setTextAlign("left");
    else if (editor.isActive({ textAlign: "right" }))
      chain.setTextAlign("right");
    else if (editor.isActive({ textAlign: "center" }))
      chain.setTextAlign("center");
  }

  function getCurrentHeading() {
    let noHeading =
      !props.editor.isActive("heading", { level: 1 }) &&
      !props.editor.isActive("heading", { level: 2 }) &&
      !props.editor.isActive("heading", { level: 3 });

    if (props.editor.isActive("heading", { level: 1 }))
      return (
        <Button
          onClick={() => {
            let chain = props.editor.chain().toggleHeading({ level: 2 });
            editorChainKeepAlign(props.editor, chain);
            chain.run();
          }}
          isActive={props.editor.isActive("heading", { level: 1 })}
        >
          <div style={{ color: "#fff" }}>
            <FaHeading />1
          </div>
        </Button>
      );

    if (props.editor.isActive("heading", { level: 2 }))
      return (
        <Button
          onClick={() => {
            let chain = props.editor.chain().toggleHeading({ level: 3 });
            editorChainKeepAlign(props.editor, chain);
            chain.run();
          }}
          isActive={props.editor.isActive("heading", { level: 2 })}
        >
          <div style={{ color: "#fff" }}>
            <FaHeading />2
          </div>
        </Button>
      );

    if (props.editor.isActive("heading", { level: 3 }))
      return (
        <Button
          onClick={() => {
            let chain = props.editor.chain().toggleHeading({ level: 3 });
            editorChainKeepAlign(props.editor, chain);
            chain.run();
          }}
          isActive={props.editor.isActive("heading", { level: 3 })}
        >
          <div style={{ color: "#fff" }}>
            <FaHeading />3
          </div>
        </Button>
      );

    // Toggle the third one back to paragraph
    if (noHeading)
      return (
        <Button
          onClick={() => {
            let chain = props.editor.chain().toggleHeading({ level: 1 });
            editorChainKeepAlign(props.editor, chain);
            chain.run();
          }}
        >
          <div style={{ color: "#fff" }}>
            <FaHeading />
          </div>
        </Button>
      );
  }

  function getCurrentAlignment() {
    if (props.editor.isActive({ textAlign: "center" })) {
      return (
        <Button
          onClick={() => props.editor.chain().setTextAlign("right").run()}
          isActive={props.editor.isActive({ textAlign: "center" })}
        >
          <div style={{ color: "#fff" }}>
            <FaAlignCenter />
          </div>
        </Button>
      );
    }
    if (props.editor.isActive({ textAlign: "right" })) {
      return (
        <Button
          onClick={() => props.editor.chain().setTextAlign("justify").run()}
          isActive={props.editor.isActive({ textAlign: "right" })}
        >
          <div style={{ color: "#fff" }}>
            <FaAlignRight />
          </div>
        </Button>
      );
    }

    if (props.editor.isActive({ textAlign: "justify" })) {
      return (
        <Button
          onClick={() => props.editor.chain().setTextAlign("left").run()}
          isActive={props.editor.isActive({ textAlign: "justify" })}
        >
          <div style={{ color: "#fff" }}>
            <FaAlignJustify />
          </div>
        </Button>
      );
    }

    return (
      <Button
        onClick={() => props.editor.chain().setTextAlign("center").run()}
        isActive={true}
      >
        <div style={{ color: "#fff" }}>
          <FaAlignLeft />
        </div>
      </Button>
    );
  }

  return (
    <Container>
      <Wrapper>
        <Button
          onClick={() => props.editor.chain().focus().toggleBold().run()}
          isActive={props.editor.isActive("bold")}
        >
          <div style={{ color: "#fff" }}>
            <FaBold />
          </div>
        </Button>
        <Button
          onClick={() => props.editor.chain().focus().toggleItalic().run()}
          isActive={props.editor.isActive("italic")}
        >
          <div style={{ color: "#fff" }}>
            <FaItalic />
          </div>
        </Button>
        <Button
          onClick={() => props.editor.chain().focus().toggleStrike().run()}
          isActive={props.editor.isActive("strike")}
        >
          <div style={{ color: "#fff" }}>
            <FaStrikethrough />
          </div>
        </Button>

        <Button
          onClick={() => props.editor.chain().focus().toggleUnderline().run()}
          isActive={props.editor.isActive("underline")}
        >
          <div style={{ color: "#fff" }}>
            <FaUnderline />
          </div>
        </Button>
        {getCurrentHeading()}
        {getCurrentAlignment()}

        {/* Links */}
        {!props.editor.isActive("link") ? (
          <Button
            onClick={() => {
              linkURL.current = "";
              // modal.pushModal(
              //   <ModalContainer>
              //     <StyledInput
              //       placeholder="Enter link"
              //       onChange={(e) => (linkURL.current = e.target.value)}
              //     />
              //     <ButtonsWrapperModal>
              //       <StyledButton onClick={() => modal.popModal()} inverted>
              //         Cancel
              //       </StyledButton>
              //       <StyledButton
              //         onClick={() => {
              //           props.editor
              //             .chain()
              //             .focus()
              //             .setLink({ href: linkURL.current, target: "_blank" })
              //             .run();
              //           modal.popModal();
              //         }}
              //       >
              //         Add
              //       </StyledButton>
              //     </ButtonsWrapperModal>
              //   </ModalContainer>,
              //   "Add link"
              // );
              // const url = window.prompt("URL");
              // if (!url) return;
              // props.editor
              //   .chain()
              //   .focus()
              //   .setLink({ href: url, target: "_blank" })
              //   .run();
            }}
            isActive={props.editor.isActive("link")}
          >
            <div style={{ color: "#fff" }}>
              <FaLink />
            </div>
          </Button>
        ) : (
          <Button
            onClick={() => props.editor.chain().focus().unsetLink().run()}
            isActive={props.editor.isActive("link")}
          >
            <div style={{ color: "#fff" }}>
              <FaUnlink />
            </div>
          </Button>
        )}
      </Wrapper>
    </Container>
  );
}
