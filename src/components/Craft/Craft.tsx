/** @jsxImportSource @emotion/react */
import { Editor, Element, Frame } from "@craftjs/core";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { Button } from "./Elements/Button";
import { Image } from "./Elements/Image";
import { Container } from "./Elements/Container/Container";
import { Main } from "./Elements/Main";
import { Text } from "./Elements/Text/Text";
import LeftSidebar from "./LeftSidebar/LeftSidebar";
import { RightSidebar } from "./RightSidebar/RightSidebar";
import TopBar from "./TopBar/TopBar";
import { craftStyle } from "./utils/style";

const Wrapper = styled.div<{ isPreview: boolean }>`
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
    props.isPreview &&
    css`
      display: block;
      position: fixed;
      grid-template-columns: 1px auto 1px;
      padding-top: 0px;
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
        // onRender={RenderNode}
      >
        <TopBar onSave={() => {}} />

        <Wrapper isPreview={false} className="page-container">
          <LeftSidebar />
            <Frame>
              <Element canvas is={Main} />
            </Frame>
          <RightSidebar />
        </Wrapper>
      </Editor>
    </>
  );
}
