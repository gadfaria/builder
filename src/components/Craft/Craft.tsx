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
              padding={5}
              background="#eeeeee"
              data-cy="root-container"
            ></Element>
          </Frame>
          <RightSidebar />
          {/* <Grid item xs={4}>
            <Paper className={classes.root}>
              <Toolbox />
              <SettingsPanel />
            </Paper>
          </Grid> */}
        </Wrapper>
      </Editor>
    </>
  );
}
