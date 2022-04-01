/** @jsxImportSource @emotion/react */
import { Editor, Element, Frame, useEditor } from "@craftjs/core";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useEffect } from "react";
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
import { useRecoilState } from "recoil";
import { builderAtom } from "./utils/atoms";
import { IBuilder } from "./utils/types";

import lz from "lzutf8";

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

interface Props {
  builder: IBuilder;
  onSave: (builder: IBuilder) => void;
}

export default function Craft(props: Props) {
  const [builder, setBuilder] = useRecoilState(builderAtom);

  function handleClickSave(builderStructure: string) {
    if (!builder) return;
    props.onSave({ ...builder, builder: builderStructure });
  }

  useEffect(() => {
    if (!props.builder) return;
    const json = lz.decompress(lz.decodeBase64(props.builder?.builder || ""));
    setBuilder({ ...props.builder, builder: json });
  }, [props.builder]);

  if (!builder) return <></>;
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
        <Content handleClickSave={handleClickSave} builder={builder} />
      </Editor>
    </>
  );
}

interface ContentProps {
  handleClickSave: (builderStructure: string) => void;
  builder: IBuilder;
}

function Content(props: ContentProps) {
  const { enabled, actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
  }));

  useEffect(() => {
    if (!props.builder.builder) return;
    actions.deserialize(props.builder.builder);
  }, []);

  return (
    <>
      <TopBar handleClickSave={props.handleClickSave} />

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
