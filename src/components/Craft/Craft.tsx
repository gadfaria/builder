/** @jsxImportSource @emotion/react */
import { Editor, Element, Frame } from "@craftjs/core";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { builderStyle } from "../Builder/BuilderStyle";
import { Button } from "./Elements/Button";
import { Container } from "./Elements/Container";
import { Text } from "./Elements/Text";
import LeftSidebar from "./LeftSidebar/LeftSidebar";
import { RightSidebar } from "./RightSidebar/RightSidebar";
import TopBar from "./TopBar/TopBar";

const Wrapper = styled.div<{ isPreview: boolean }>`
  ${builderStyle}
  display: grid;
  max-width: 100vw;
  width: 100%;
  grid-template-columns: 300px auto 300px;
  height: 100vh;
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
          Container,
        }}
      >
        <TopBar onSave={() => {}} />

        <Wrapper isPreview={false}>
          <LeftSidebar />
          <Frame>
            <Element
              canvas
              is={Container}
              width="800px"
              height="auto"
              custom={{ displayName: "App" }}
            />
          </Frame>
          <RightSidebar />
        </Wrapper>
      </Editor>
    </>
  );
}
