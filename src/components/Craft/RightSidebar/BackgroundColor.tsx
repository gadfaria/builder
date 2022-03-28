/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import InputColor from "./InputColor";
const Wrapper = styled.div`
  margin: 0px 25px 30px;
`;

interface Props {
  backgroundColor: string;
  setValue: (value: string | undefined, key: string) => void;
}
export default function BackgroundColor({ backgroundColor, setValue }: Props) {
  return (
    <>
      <Wrapper
        css={css`
          margin-bottom: 10px;
        `}
      >
        <InputColor
          isBackground
          label="Background Color"
          color={backgroundColor}
          handleChangeColor={(color) => setValue(color, "backgroundColor")}
        />
      </Wrapper>
    </>
  );
}
