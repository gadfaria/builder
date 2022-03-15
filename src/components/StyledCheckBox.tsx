/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React from "react";
import { DEFAULT_COLOR } from "./Builder/BuilderConsts";

interface Props {
  check: boolean;
  color?: string;
  handleCheck: () => void;
  customCss?: any;
  disabled?: boolean;
}

interface CheckProps {
  check: boolean;
  color: string;
}

const Icon = styled.img`
  width: 10px;
  height: 10px;
`;

const Container = styled.div<CheckProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => (props.check ? props.color : "#cccccc")};
  width: 15px;
  height: 15px;
  margin: 3px 3px 4px 4px;
  border-radius: 2px;
  background-color: ${(props) => (props.check ? props.color : "#ffffff")};
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

export default function StyledCheckBox(props: Props): JSX.Element {
  const { check, handleCheck, disabled, customCss, color } = props;

  return (
    <Container
      onClick={(e) => {
        if (disabled) return;
        e.stopPropagation();
        handleCheck();
      }}
      check={check}
      css={customCss}
      color={color || DEFAULT_COLOR}
    >
      {check && <Icon src={"../icons/check.svg"} />}
    </Container>
  );
}
