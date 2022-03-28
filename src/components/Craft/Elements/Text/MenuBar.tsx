/** @jsxImportSource @emotion/react */
import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
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
import { DEFAULT_COLOR } from "../../utils/consts";
import {
  buttonOutlineChakra,
  buttonDimensionsChakra,
  buttonSolidChakra,
} from "../../utils/style";

interface Props {
  editor: Editor;
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

const StyledButton = styled.div<{ isActive?: boolean }>`
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




export default function MenuBar(props: Props) {
  const linkURL = useRef<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (!props.editor) {
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
        <StyledButton
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
        </StyledButton>
      );

    if (props.editor.isActive("heading", { level: 2 }))
      return (
        <StyledButton
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
        </StyledButton>
      );

    if (props.editor.isActive("heading", { level: 3 }))
      return (
        <StyledButton
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
        </StyledButton>
      );

    // Toggle the third one back to paragraph
    if (noHeading)
      return (
        <StyledButton
          onClick={() => {
            let chain = props.editor.chain().toggleHeading({ level: 1 });
            editorChainKeepAlign(props.editor, chain);
            chain.run();
          }}
        >
          <div style={{ color: "#fff" }}>
            <FaHeading />
          </div>
        </StyledButton>
      );
  }

  function getCurrentAlignment() {
    if (props.editor.isActive({ textAlign: "center" })) {
      return (
        <StyledButton
          onClick={() => props.editor.chain().setTextAlign("right").run()}
          isActive={props.editor.isActive({ textAlign: "center" })}
        >
          <div style={{ color: "#fff" }}>
            <FaAlignCenter />
          </div>
        </StyledButton>
      );
    }
    if (props.editor.isActive({ textAlign: "right" })) {
      return (
        <StyledButton
          onClick={() => props.editor.chain().setTextAlign("justify").run()}
          isActive={props.editor.isActive({ textAlign: "right" })}
        >
          <div style={{ color: "#fff" }}>
            <FaAlignRight />
          </div>
        </StyledButton>
      );
    }

    if (props.editor.isActive({ textAlign: "justify" })) {
      return (
        <StyledButton
          onClick={() => props.editor.chain().setTextAlign("left").run()}
          isActive={props.editor.isActive({ textAlign: "justify" })}
        >
          <div style={{ color: "#fff" }}>
            <FaAlignJustify />
          </div>
        </StyledButton>
      );
    }

    return (
      <StyledButton
        onClick={() => props.editor.chain().setTextAlign("center").run()}
        isActive={true}
      >
        <div style={{ color: "#fff" }}>
          <FaAlignLeft />
        </div>
      </StyledButton>
    );
  }

  return (
    <Container>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup>
              <InputLeftAddon children="https://" />
              <Input
                focusBorderColor={DEFAULT_COLOR}
                placeholder="Enter link"
                onChange={(e) =>
                  (linkURL.current = "https://" + e.target.value)
                }
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              {...buttonOutlineChakra}
              {...buttonDimensionsChakra}
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              {...buttonSolidChakra}
              {...buttonDimensionsChakra}
              onClick={() => {
                props.editor
                  .chain()
                  .focus()
                  .setLink({ href: linkURL.current, target: "_blank" })
                  .run();
                onClose();
                // const url = window.prompt("URL");
                // if (!url) return;
                // props.editor
                //   .chain()
                //   .focus()
                //   .setLink({ href: url, target: "_blank" })
                //   .run();
              }}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Wrapper>
        <StyledButton
          onClick={() => props.editor.chain().focus().toggleBold().run()}
          isActive={props.editor.isActive("bold")}
        >
          <div style={{ color: "#fff" }}>
            <FaBold />
          </div>
        </StyledButton>
        <StyledButton
          onClick={() => props.editor.chain().focus().toggleItalic().run()}
          isActive={props.editor.isActive("italic")}
        >
          <div style={{ color: "#fff" }}>
            <FaItalic />
          </div>
        </StyledButton>
        <StyledButton
          onClick={() => props.editor.chain().focus().toggleStrike().run()}
          isActive={props.editor.isActive("strike")}
        >
          <div style={{ color: "#fff" }}>
            <FaStrikethrough />
          </div>
        </StyledButton>

        <StyledButton
          onClick={() => props.editor.chain().focus().toggleUnderline().run()}
          isActive={props.editor.isActive("underline")}
        >
          <div style={{ color: "#fff" }}>
            <FaUnderline />
          </div>
        </StyledButton>
        {getCurrentHeading()}
        {getCurrentAlignment()}

        {/* Links */}
        {!props.editor.isActive("link") ? (
          <StyledButton
            onClick={() => {
              linkURL.current = "";
              onOpen();
            }}
            isActive={props.editor.isActive("link")}
          >
            <div style={{ color: "#fff" }}>
              <FaLink />
            </div>
          </StyledButton>
        ) : (
          <StyledButton
            onClick={() => props.editor.chain().focus().unsetLink().run()}
            isActive={props.editor.isActive("link")}
          >
            <div style={{ color: "#fff" }}>
              <FaUnlink />
            </div>
          </StyledButton>
        )}
      </Wrapper>
    </Container>
  );
}
