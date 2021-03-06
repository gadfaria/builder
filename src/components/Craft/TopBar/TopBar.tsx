/** @jsxImportSource @emotion/react */
import { Button, useToast } from "@chakra-ui/react";
import { useEditor } from "@craftjs/core";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import lz from "lzutf8";
import React, { useState } from "react";
import { FaRedo, FaUndo } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import {
  buttonDimensionsChakra,
  buttonOutlineChakra,
  buttonSolidChakra,
  Flex,
} from "../utils/style";

const Wrapper = styled.div`
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #dddddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  grid-gap: 8px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  cursor: default;
`;

const TopBarTitle = styled.div`
  font-size: 20px;
  letter-spacing: 0.3px;
  font-weight: 600;
  color: #333333;
`;

const TopBarSubTitle = styled.div`
  display: flex;
  font-size: 14px;
  letter-spacing: 0.2px;
  color: #707070;
`;

const Icon = styled.div`
  margin: 0px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  handleClickSave: (builderStructure: string) => void;
}

export default function TopBar(props: Props): JSX.Element {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { enabled, canUndo, canRedo, actions, query } = useEditor(
    (state, query) => ({
      enabled: state.options.enabled,
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
    })
  );

  async function handleClickSave() {
    setIsSaving(true);
    const json = query.serialize();
    const encode = lz.encodeBase64(lz.compress(json));

    props.handleClickSave(encode);

    setTimeout(() => {
      toast({
        title: "Saved.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setIsSaving(false);
    }, 2000);
  }

  if (!enabled)
    return (
      <div
        css={css`
          position: absolute;
        `}
        onClick={() => {
          actions.setOptions((options) => (options.enabled = !enabled));
        }}
      >
        botao
      </div>
    );

  return (
    <Wrapper>
      <TitleContainer>
        <Flex>
          <TopBarTitle>Builder</TopBarTitle>
          <Icon>
            <FiChevronRight />
          </Icon>
          <TopBarTitle>{"aaa"}</TopBarTitle>
        </Flex>
        <TopBarSubTitle>
          Created on {dayjs().format("MMM DD, YYYY @ h:MM a")}
        </TopBarSubTitle>
      </TitleContainer>

      <ButtonsContainer>
        <Icon onClick={() => actions.history.undo()}>
          <FaUndo />
        </Icon>

        <Icon onClick={() => actions.history.redo()}>
          <FaRedo />
        </Icon>

        <Button
          {...buttonDimensionsChakra}
          {...buttonOutlineChakra}
          onClick={() => {
            actions.setOptions((options) => (options.enabled = !enabled));
          }}
        >
          Preview
        </Button>

        <Button
          {...buttonDimensionsChakra}
          {...buttonSolidChakra}
          isLoading={isSaving}
          loadingText="Saving"
          onClick={handleClickSave}
        >
          Save
        </Button>
      </ButtonsContainer>
    </Wrapper>
  );
}
