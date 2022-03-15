/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { encode } from "base64-arraybuffer";
import { PrimitiveAtom, useAtom } from "jotai";
import React, {
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
} from "react";
import { useDropzone } from "react-dropzone";
import { ItemType } from "./Builder";

const Container = styled.div<{ isPreview: boolean }>`
  width: 100%;
  height: 100%;
  ${(props) =>
    !props.isPreview &&
    css`
      max-height: calc(100vh - 81px);
    `}
`;

const Content = styled.div<{ isPreview: boolean }>`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: ${(props) => (props.isPreview ? "5px" : "40px")};
`;

const CoverImage = styled.img`
  position: fixed;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  right: 0px;
  object-fit: cover;
`;

interface Props {
  index: number;
  itemAtom: PrimitiveAtom<ItemType>;
  isPreview: boolean;
  isSelected: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function BuilderMain(props: PropsWithChildren<Props>) {
  const { isSelected, onClick, itemAtom, index, isPreview, children } = props;

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        setItem({
          ...item,
          state: {
            ...item.state,
            image: `data:image/png;base64,${encode(binaryStr as ArrayBuffer)}`,
          },
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });
  const [item, setItem] = useAtom(itemAtom);

  return (
    <Container
      onClick={onClick}
      isPreview={isPreview}
      css={css`
        .form-builder-item-container {
          width: ${item.style?.width ? item.style?.width : "1152px"};
          max-width: 100vw;
        }
      `}
    >
      {item.state?.image && (
        <CoverImage
          alt="Background image"
          src={`${item.state?.image}`}
          style={{ opacity: item.style?.opacity ? item.style?.opacity : 1 }}
        />
      )}
      <Content
        {...(!isPreview && isSelected && { ...getRootProps() })}
        isPreview={isPreview}
        style={{
          ...(item.style?.backgroundColor && {
            backgroundColor: item.style.backgroundColor,
          }),
          opacity: 1,
        }}
      >
        {!isPreview && <input {...getInputProps()} />}
        {children}
      </Content>
    </Container>
  );
}
