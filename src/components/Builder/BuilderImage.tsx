/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { encode } from "base64-arraybuffer";
import React, { SetStateAction, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { BiImageAlt } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { ItemType } from "./Builder";
import { Empty } from "./BuilderEditor";
import { BackgroundImageIcons } from "./BuilderSidebar";
interface Props {
  item: ItemType;
  setItem: (update: SetStateAction<ItemType>) => void;
  isSelected?: boolean;
  isPreview?: boolean;
}

const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

const EmptyImageCss = css`
  height: 240px;
  svg {
    width: 76px;
    height: 76px;
    margin-bottom: 10px;
  }
`;

const BuilderImage = (props: Props) => {
  const { isSelected, item, setItem, isPreview } = props;

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
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  function handleClearBackground(e: any) {
    e.stopPropagation();
    setItem({
      ...item,
      state: {
        ...item.state,
        image: undefined,
      },
    });
  }

  return (
    <div {...(!isPreview && isSelected && { ...getRootProps() })}>
      {!isPreview && <input {...getInputProps()} />}
      {item.state?.image ? (
        <div
          css={css`
            position: relative;
          `}
        >
          {!isPreview && (
            <BackgroundImageIcons onClick={handleClearBackground}>
              <FaRegTrashAlt />
            </BackgroundImageIcons>
          )}
          <Image src={item.state.image} />
        </div>
      ) : (
        !isPreview && (
          <Empty
            css={css`
              ${EmptyImageCss}
              ${isSelected &&
              css`
                border-color: transparent;
              `}
            `}
          >
            <BiImageAlt />
            Click here to select an image
          </Empty>
        )
      )}
    </div>
  );
};

export default BuilderImage;
