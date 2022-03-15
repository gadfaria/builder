/** @jsxImportSource @emotion/react */

import { Button } from "@chakra-ui/react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { SetStateAction, useAtom } from "jotai";
import React, { useState } from "react";
import "react-phone-input-2/lib/bootstrap.css";
import { builderCheckboxAtom } from "./BuilderAtoms";
import { DEFAULT_COLOR } from "./BuilderConsts";
import { ItemType } from "./BuilderTypes";

const Container = styled.div<{ isSelected?: boolean }>`
  padding: ${(props) => (props.isSelected ? "10px" : "0px")};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .fake-input {
    opacity: 0;
    position: absolute;
    z-index: -999;
  }
`;

const inputChakra = {
  marginBottom: "12px",
  width: 340,
  height: 46,
  fontSize: 18,
};

const buttonChakra = {
  width: 340,
  height: 46,
  fontSize: 18,
  fontWeight: "bold",
  color: "white",
};

interface Props {
  item: ItemType;
  setItem: (update: SetStateAction<ItemType>) => void;
  isSelected?: boolean;
  isPreview?: boolean;
}

export default function BuilderButton(props: Props): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [checkbox] = useAtom(builderCheckboxAtom);

  async function handleClick() {
    setIsLoading(true);

    window.open(props.item.state.url);
    setIsLoading(false);
  }

  return (
    <Container
      isSelected={props.isSelected}
      css={css`
        pointer-events: ${props.isPreview ? "auto" : "none"};
      `}
    >
      <Button
        {...buttonChakra}
        bgColor={props.item.style?.color || DEFAULT_COLOR}
        _hover={{
          bgColor: (props.item.style?.color || DEFAULT_COLOR) + "80",
        }}
        isLoading={isLoading}
        onClick={handleClick}
      >
        {props.item.state?.buttonText
          ? props.item.state.buttonText
          : "Get Started"}
      </Button>
    </Container>
  );
}
