/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { IoMdClose } from "react-icons/io";
import useClickOutside from "../hooks/useClickOutside";
const Wrapper = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  position: relative;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0px;
  color: #333333;
  margin-bottom: 8px;
`;

const Color = styled.div`
  width: 36px;
  height: 100%;
  border-right: 1px solid #eaeaea;
  border-radius: 4px;
`;

const ColorHex = styled.div`
  padding-left: 11px;
  font-size: 16px;
  letter-spacing: 0px;
  color: #333333;
  display: flex;
  align-items: center;
`;

const SelectColor = styled.div`
  position: absolute;
  z-index: 2;
  top: 32px;
  left: 12px;
`;

type Props = {
  color?: string;
  isBackground?: boolean;
  label: string;
  handleChangeColor: (color?: string) => void;
};

export default function ColorInput(props: Props) {
  const [openColor, setOpenColor] = useState<boolean>(false);

  const colorDivRef = useClickOutside(() => {
    setOpenColor(false);
  });

  return (
    <>
      <Label>{props.label}</Label>
      <Wrapper onClick={() => setOpenColor(true)}>
        <Color
          css={
            !props.color && props.isBackground
              ? css`
                  background: linear-gradient(
                      to top left,
                      rgba(0, 0, 0, 0) 0%,
                      rgba(0, 0, 0, 0) calc(50% - 0.8px),
                      #c41700 50%,
                      rgba(0, 0, 0, 0) calc(50% + 0.8px),
                      rgba(0, 0, 0, 0) 100%
                    ),
                    linear-gradient(
                      to top right,
                      rgba(0, 0, 0, 0) 0%,
                      rgba(0, 0, 0, 0) calc(50% - 0.8px),
                      rgba(0, 0, 0, 0) 50%,
                      rgba(0, 0, 0, 0) calc(50% + 0.8px),
                      rgba(0, 0, 0, 0) 100%
                    );
                `
              : css`
                  background-color: ${props.color ? props.color : "#ffffff"};
                `
          }
        />
        <ColorHex>
          {props.color
            ? props.color.toLocaleUpperCase()
            : props.isBackground
            ? "None"
            : "#ffffff"}
        </ColorHex>
        {/* <div> */}
        {props.color && props.isBackground && (
          <IoMdClose
            onClick={(e) => {
              e.stopPropagation();
              props.handleChangeColor(undefined);
            }}
            css={css`
              color: #777777;
              cursor: pointer;
              position: absolute;
              right: 6px;
              top: 9px;
            `}
          />
        )}
        {/* </div> */}
        {openColor && (
          <SelectColor ref={colorDivRef}>
            <SketchPicker
              color={props.color || "#FFFFF"}
              onChangeComplete={(color) => props.handleChangeColor(color.hex)}
            />
          </SelectColor>
        )}
      </Wrapper>
    </>
  );
}
