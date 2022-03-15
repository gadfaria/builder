/** @jsxImportSource @emotion/react */
import { useDraggable } from "@dnd-kit/core";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import ReactTooltip from "react-tooltip";
import { customTooltip } from "../../utils/style";
import { TooltipText, Types } from "./Builder";
import { DEFAULT_COLOR } from "./BuilderConsts";

const Container = styled.div`
  /* z-index: 10; */
`;

const Wrapper = styled.div<{ disabled: boolean }>`
  width: 115px;
  height: 100px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0px;
  color: #707070;
  border: 1px solid #eaeaea;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  cursor: grabbing;

  transition: opacity 0.3s;

  :hover {
    opacity: 0.5;
  }

  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      opacity: 0.4;
    `}

  > img {
    width: 20px;
    height: 20px;
    margin-bottom: 8px;
  }
`;

const IsDraggingCss = css`
  opacity: 1;
  border-color: ${DEFAULT_COLOR};
  background-color: #fff;
  :hover {
    opacity: 1;
  }
`;

type Props = {
  label: string;
  type: Types;
  icon: string;
  alreadyExists: boolean;
};

const CAN_ONLY_HAVE_ONE = ["FOOTER", "CHECKBOX", "FORM"];

export default function BuilderSideBarCard(props: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.type,
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const disabled =
    props.alreadyExists && CAN_ONLY_HAVE_ONE.includes(props.type);

  return (
    <Container data-tip data-for={props.type}>
      <Wrapper
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        disabled={disabled}
        css={isDragging && IsDraggingCss}
      >
        <img src={props.icon} alt="IconImage" />
        {props.label}
      </Wrapper>
      {disabled && (
        <ReactTooltip
          id={props.type}
          place="right"
          effect="solid"
          backgroundColor="#333333"
          css={customTooltip}
        >
          <TooltipText>
            You can only select one {props.type.toLocaleLowerCase()}
          </TooltipText>
        </ReactTooltip>
      )}
    </Container>
  );
}
