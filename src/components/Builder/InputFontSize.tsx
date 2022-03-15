/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { CgMathMinus, CgMathPlus } from "react-icons/cg";

const Wrapper = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #eaeaea;
  border-radius: 4px;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0px;
  color: #333333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: min-content;
  border: none;
  text-indent: 5px;
`;

const Button = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid;
  border-color: transparent;
  border-left-color: #eaeaea;
  transition: border-color 0.3s;

  svg {
    transition: color 0.3s;
    color: #707070;
  }

  :hover {
    border-color: #fb972e80;

    svg {
      color: #fb972e;
    }
  }
`;

interface Props {
  value: number;
  handleValueChange: (vle: number) => void;
  label: string;
  interval?: number;
}

export default function FormInputNumber(props: Props) {
  return (
    <>
      <Label>{props.label}</Label>
      <Wrapper>
        <Input
          type="number"
          value={props.value}
          onChange={(event) => {
            props.handleValueChange(parseFloat(event.target.value));
          }}
        />
        <div
          css={css`
            display: flex;
          `}
        >
          <Button
            onClick={() => {
              props.handleValueChange(props.value - (props.interval || 1));
            }}
          >
            <CgMathMinus />
          </Button>
          <Button
            onClick={() => {
              props.handleValueChange(props.value + (props.interval || 1));
            }}
          >
            <CgMathPlus />
          </Button>
        </div>
      </Wrapper>
    </>
  );
}
