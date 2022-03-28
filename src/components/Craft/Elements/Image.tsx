/** @jsxImportSource @emotion/react */
import { useNode } from "@craftjs/core";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { encode } from "base64-arraybuffer";
import React, { useRef } from "react";
import { BiImageAlt } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import ImageSettings from "../RightSidebar/ImageSettings";
import { DEFAULT_COLOR } from "../utils/consts";

const ImageDiv = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
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
  height: 240px;
  svg {
    width: 76px;
    height: 76px;
    margin-bottom: 10px;
  }
`;

export const BackgroundImageIcons = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  cursor: pointer;
  svg {
    color: #000;
    transition: color 0.3s;
  }
  :hover {
    svg {
      color: ${DEFAULT_COLOR};
      transition: color 0.3s;
    }
  }
`;

export const Image = ({ image, width, ...props }: any) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  const imageRef = useRef<HTMLInputElement>(null);

  async function onFileChange(e: any) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        setProp(
          (props: Record<string, any>) =>
            (props.image = `data:image/png;base64,${encode(
              binaryStr as ArrayBuffer
            )}`),
          1000
        );
      };
      reader.readAsArrayBuffer(file);
    }
  }

  function handleClearBackground(e: any) {
    e.stopPropagation();
    setProp((props: Record<string, any>) => (props.image = undefined), 1000);
  }

  return (
    <div ref={(ref) => ref && connect(drag(ref))}>
      {image ? (
        <div
          css={css`
            position: relative;
          `}
        >
          {
            <BackgroundImageIcons onClick={handleClearBackground}>
              <FaRegTrashAlt />
            </BackgroundImageIcons>
          }
          <ImageDiv
            src={image}
            css={css`
              width: ${width}%;
              height: auto;
            `}
          />
        </div>
      ) : (
        <>
          {selected && (
            <input
              ref={imageRef}
              type="file"
              multiple
              accept="image/*"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
          )}
          <Empty onClick={() => imageRef.current?.click()}>
            <BiImageAlt />
            Click here to select an image
          </Empty>
        </>
      )}
    </div>
  );
};

const Settings = () => {
  const {
    actions: { setProp },
    ...props
  } = useNode((node) => ({
    props: node.data.props,
    width: node.data.props.width,
  }));

  return (
    <>
      <ImageSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />
    </>
  );
};

export const ImageDefaultProps = {
  width: 100,
};

Image.craft = {
  props: ImageDefaultProps,
  related: {
    settings: Settings,
  },
};
