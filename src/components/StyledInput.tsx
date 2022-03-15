import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
} from "react";

export type RefUtil<T> =
  | ((instance: T | null) => void)
  | React.MutableRefObject<T | null>
  | null;

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  error?: boolean;
}

const Input = styled.input<Props>`
  width: 100%;
  height: 40px;
  border: 1px solid #dddddd;
  border-radius: 5px;
  outline: none;
  font-size: 15px;
  padding: 10px;
  color: #383838;

  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  :focus {
    box-shadow: 0px 0px 6px #fb972e4d;
    border: 1px solid #fb972e;
  }

  &::placeholder {
    font-size: 14px;
    letter-spacing: 0.16px;
    color: #979797;
  }

  transition: box-shadow 0.3s, border 0.3s;

  ${(props) =>
    props.error &&
    css`
      border: 1px solid #c41700;
      box-shadow: 0px 0px 6px #c417004d;
    `}

  background-color: #ffffff;
`;

function StyledInput(
  props: Props,
  ref: RefUtil<HTMLInputElement>
): JSX.Element {
  return <Input {...props} ref={ref} />;
}

export default forwardRef<HTMLInputElement, Props>(StyledInput);
