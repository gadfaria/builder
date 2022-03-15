/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { CSSProperties } from "react";
import { FaCheck } from "react-icons/fa";

interface IListItemContainer {
  isHover: boolean;
  isSelected: boolean;
  noOption?: boolean;
  font?: string;
}

const ListItemContainer = styled.div<IListItemContainer>`
  border-bottom: 1px solid #d4d4d4;
  border: 1px solid transparent;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: ${(props) => (props.isHover ? "#FFF2E5" : "#fff")};
  color: ${(props) => (props.isHover ? "#fb972e" : "#000")};
  font-family: ${(props) => props.font && props.font};

  ${(props) =>
    props.isSelected &&
    css`
      background-color: #fcebd8;
      color: #fb972e;
    `}

  ${(props) =>
    !props.noOption &&
    css`
      :hover {
        background-color: #fff2e5;
        color: #fb972e;
      }
    `}
`;

const ListIconContainer = styled.div`
  margin-right: 10px;
`;

interface IListItemText {
  font?: string;
}

const ListItemText = styled.span<IListItemText>`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-family: ${(props) => props.font && props.font};
`;

const Row = styled.div`
  overflow-x: hidden;
  display: flex;
`;

interface Props {
  name: string;
  font?: string;
  startIcon?: JSX.Element;
  noOption?: boolean;
  isHover: boolean;
  isSelected: boolean;
  alreadyWrittenText: string;
  customStyle?: CSSProperties;
  removeCheckIcon?: boolean;
  onClick: () => void;

  customItemToolbar?: JSX.Element;
}

export function AutoCompleteSelectItem(props: Props): JSX.Element {
  const {
    startIcon,
    font,
    name,
    isHover,
    customStyle,
    onClick,
    isSelected,
    noOption,
    removeCheckIcon,
    customItemToolbar,
  } = props;

  return (
    <ListItemContainer
      style={customStyle}
      isHover={isHover}
      isSelected={isSelected}
      noOption={noOption}
      onClick={onClick}
      font={font}
    >
      <Row>
        {startIcon && <ListIconContainer>{startIcon}</ListIconContainer>}
        <ListItemText font={font}>{name}</ListItemText>
      </Row>

      <Row>
        {customItemToolbar ? customItemToolbar : null}

        {isSelected && !removeCheckIcon && (
          <FaCheck color={"#FB972E"} width={14} height={14} />
        )}
      </Row>
    </ListItemContainer>
  );
}
