/** @jsxImportSource @emotion/react */
import { useEditor } from "@craftjs/core";
import styled from "@emotion/styled";
import React from "react";
import { Type } from "./LeftSidebar";

const Wrapper = styled.div`
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

  > img {
    width: 20px;
    height: 20px;
    margin-bottom: 8px;
  }
`;

export default function LeftSidebarCard(props: Type) {
  const { connectors } = useEditor();

  return (
    <div ref={(ref) => ref && connectors.create(ref, props.component)}>
      <Wrapper>
        <img src={props.icon} alt="IconImage" />
        {props.label}
      </Wrapper>
    </div>
  );
}
