import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
} from "react";
import { notSelect } from "../../utils/style";

export interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  inverted?: boolean;
  isLoading?: boolean;
  disable?: boolean;
}

const InvertedColors = css`
  background-color: white;
  border-color: #dddddd;
  color: #555555;
`;

const NormalColors = css`
  background-color: #fb972e;
  border-color: #fb972e;
  color: white;
`;

const Button: any = styled.button`
  border: 1px solid #fb972e;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0px;
  padding: 10px 20px;
  ${notSelect}

  cursor: pointer;
  ${(props: Props) => (props.inverted ? InvertedColors : NormalColors)}

  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
  &:hover,
  &:active {
    &:not([disabled]) {
      opacity: 0.7;
    }
  }

  > span {
    padding-left: 1px;
  }
`;

const CircleLoading = styled.div`
  position: relative;
  width: 1em;
  height: 19px;
`;

const CircleStyle = styled(motion.span)`
  width: 1.5rem;
  height: 1.5rem;
  border: 0.3rem solid #cccccc;
  border-top: 0.3rem solid #ffffff;
  border-radius: 50%;
  position: absolute;
  left: -4px;
  top: -2px;
`;

const spinTransition = {
  loop: Infinity,
  ease: "linear",
  duration: 1,
};

export default function StyledButton(
  props: PropsWithChildren<Props>
): JSX.Element {
  const { children, isLoading, disable } = props;
  return (
    <Button {...props} type="button" disabled={disable || isLoading}>
      {!isLoading ? (
        children
      ) : (
        <CircleLoading>
          <CircleStyle animate={{ rotate: 360 }} transition={spinTransition} />
        </CircleLoading>
      )}
    </Button>
  );
}
