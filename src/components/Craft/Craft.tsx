/** @jsxImportSource @emotion/react */
import { Editor, Element, Frame, useEditor } from "@craftjs/core";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { Button } from "./Elements/Button";
import { Image } from "./Elements/Image";
import { Container } from "./Elements/Container/Container";
import { Main } from "./Elements/Main";
import { Text } from "./Elements/Text/Text";
import LeftSidebar from "./LeftSidebar/LeftSidebar";
import RightSidebar from "./RightSidebar/RightSidebar";
import TopBar from "./TopBar/TopBar";
import { craftStyle } from "./utils/style";
import { RenderNode } from "./Editor/RenderNode";

const Wrapper = styled.div<{ isEnable: boolean }>`
  ${craftStyle}
  display: grid;
  max-width: 100vw;
  width: 100%;
  grid-template-columns: 300px auto 300px;
  height: calc(100vh - 92px);
  min-height: 100%;
  overflow: hidden;

  @media (max-width: 1680px) {
    display: flex;
  }

  ${(props) =>
    !props.isEnable &&
    css`
      display: block;
      padding-top: 0px;
      height: 100vh;
    `}
`;

export default function Craft() {
  return (
    <>
      <Editor
        resolver={{
          Button,
          Text,
          Image,
          Container,
          Main,
        }}
        onRender={RenderNode}
      >
        <Content />
      </Editor>
    </>
  );
}

function Content() {
  const { enabled, actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
  }));

  return (
    <>
      <TopBar onSave={() => {}} />

      <Wrapper className="craft-container" isEnable={enabled}>
        {enabled && <LeftSidebar />}
        <Frame>
          <Element canvas is={Main} />
        </Frame>
        {enabled && <RightSidebar />}
      </Wrapper>
    </>
  );
}
