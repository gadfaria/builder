/** @jsxImportSource @emotion/react */
import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { AnimateSharedLayout, motion } from "framer-motion";
import { useAtom } from "jotai";
import localforage from "localforage";
import React, { useState } from "react";
import { BsGear } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import {
  buttonDimensionsChakra,
  buttonOutlineChakra,
  buttonSolidChakra,
  Flex,
  notSelect,
} from "./BuilderStyle";
import { builderAtom, isThankYouAtom } from "./BuilderAtoms";
import { DEFAULT_COLOR } from "./BuilderConsts";
import { IBuilder } from "./BuilderTypes";
import BuilderConfigModal from "./BuilderConfigModal";

const GearIconDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;

  svg {
    cursor: pointer;
    transition: color 0.3s;
    :hover {
      color: ${DEFAULT_COLOR};
    }
  }
`;

const TabContainer = styled.div`
  width: 270px;
  height: 44px;

  background-color: #f4f4f4;
  border-radius: 5px;
  color: #1b1b1b;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  transform: "translateZ(0)";

  position: relative;
`;

const Tab = styled(motion.div)`
  margin: 0;
  position: relative;
  cursor: pointer;
`;

const TabSelected = styled(motion.div)`
  width: 126px;
  height: 36px;
  border-radius: 3px;
  z-index: 10;
  text-align: center;
  position: absolute;
  margin: 4px;
  background-color: #fff;
`;

const TabTitle = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  position: absolute;
  cursor: pointer;
  ${notSelect}
`;

const Wrapper = styled.div`
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #dddddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  position: fixed;
  z-index: 99;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  grid-gap: 8px;

  .icon-button {
    min-width: 42px;
    max-width: 42px;
    min-height: 42px;
    max-height: 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #fff;

    border-radius: 5px;
    border: 1px solid #dddddd;

    cursor: pointer;

    svg {
      width: 20px;
      height: 20px;

      color: #555555;
    }

    .tooltip-text {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0px;
      color: #ffffff;
    }
  }
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

const ButtonCss = css`
  width: 100px;
  height: 42px;
`;

const IconDiv = styled.div`
  margin: 0px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  onSave: (builder: IBuilder) => void;
}

export default function BuilderTopBar(props: Props): JSX.Element {
  const toast = useToast();
  const [builder, setBuilder] = useAtom(builderAtom);
  const [isSaving, setIsSaving] = useState(false);
  const [isThankYou, setIsThankYou] = useAtom(isThankYouAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function handleClickSave() {
    setIsSaving(true);

    let itemsFromLocalForage = JSON.parse(
      (await localforage.getItem("items")) as string
    );
    let thankYouItemsFromLocalForage = JSON.parse(
      (await localforage.getItem("thank-you-items")) as string
    );

    let indexesFromLocalForage = JSON.parse(
      (await localforage.getItem("indexes")) as string
    );
    let thankYouIndexesFromLocalForage = JSON.parse(
      (await localforage.getItem("thank-you-indexes")) as string
    );

    if (!itemsFromLocalForage && !thankYouItemsFromLocalForage) {
      toast({
        title: "Saved.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setIsSaving(false);
      return;
    }

    const builderToSave = {
      ...builder,
      ...(itemsFromLocalForage &&
        indexesFromLocalForage && {
          builder: {
            items: itemsFromLocalForage,
            indexes: indexesFromLocalForage,
          },
        }),
      ...(thankYouItemsFromLocalForage &&
        thankYouIndexesFromLocalForage && {
          thankYouBuilder: {
            items: thankYouItemsFromLocalForage,
            indexes: thankYouIndexesFromLocalForage,
          },
        }),
    };

    props.onSave(builderToSave);

    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  }

  if (!builder) return <></>;
  return (
    <Wrapper>
      <BuilderConfigModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={(builder) => {
          setBuilder(builder);
          onClose();
        }}
      />
      <TitleContainer>
        <Flex>
          <TopBarTitle
            css={css`
              color: #707070;
            `}
          >
            Builder
          </TopBarTitle>
          <IconDiv>
            <FiChevronRight />
          </IconDiv>
          <TopBarTitle>{builder.name}</TopBarTitle>
        </Flex>
        <TopBarSubTitle>
          Created on {dayjs(builder.createdAt).format("MMM DD, YYYY @ h:MM a")}
        </TopBarSubTitle>
      </TitleContainer>
      {builder.hasThankYouBuilder && (
        <AnimateSharedLayout>
          <TabContainer>
            <Tab key={"page"} animate onClick={() => setIsThankYou(false)}>
              {!isThankYou && (
                <TabSelected layoutId="underline" className="underline" />
              )}
            </Tab>

            <Tab key={"thankyou"} animate onClick={() => setIsThankYou(true)}>
              {isThankYou && (
                <TabSelected layoutId="underline" className="underline" />
              )}
            </Tab>

            <TabTitle
              css={css`
                top: 12px;
                left: 50px;
              `}
              onClick={() => setIsThankYou(false)}
            >
              Form
            </TabTitle>
            <TabTitle
              css={css`
                top: 12px;
                left: 150px;
              `}
              onClick={() => setIsThankYou(true)}
            >
              Thank You Page
            </TabTitle>
          </TabContainer>
        </AnimateSharedLayout>
      )}

      <ButtonsContainer>
        <GearIconDiv onClick={onOpen}>
          <BsGear size="1.5em" />
        </GearIconDiv>
        <Button
          {...buttonDimensionsChakra}
          {...buttonOutlineChakra}
          onClick={() => {}}
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
