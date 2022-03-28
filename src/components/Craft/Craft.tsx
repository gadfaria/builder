/** @jsxImportSource @emotion/react */
import { Editor, Element, Frame } from "@craftjs/core";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { builderStyle } from "../Builder/BuilderStyle";
import TopBar from "./TopBar/TopBar";
import { Button } from "./Elements/Button";
import LeftSidebar from "./LeftSidebar/LeftSidebar";
import { RightSidebar } from "./RightSidebar/RightSidebar";
import { Card, CardBottom, CardTop } from "./user/Card";
import { Container } from "./user/Container";
import { Text } from "./Elements/Text";

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
          Card,
          Button,
          Text,
          Container,
          CardTop,
          CardBottom,
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
            >
              <Card data-cy="frame-card" />
              <Button text="Click aaa" size="small" data-cy="frame-button" />
              <Text fontSize={20} text="Hi world!" data-cy="frame-text" />
              <Element
                canvas
                is={Container}
                padding={6}
                background="#999999"
                data-cy="frame-container"
              >
                <Text
                  size="small"
                  text="It's me again!"
                  data-cy="frame-container-text"
                />
              </Element>
            </Element>
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
