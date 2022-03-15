/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { AnimateSharedLayout, motion } from "framer-motion";
import { useAtom } from "jotai";
import localforage from "localforage";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Flex, notSelect } from "../../utils/style";
import StyledButton from "../StyledButton";
import { formAtom, isThankYouAtom } from "./BuilderAtoms";

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
  width: calc(100% - 60px);
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

export default function BuilderTopBar(): JSX.Element {
  const router = useRouter();
  const [form] = useAtom(formAtom);
  const [isSaving, setIsSaving] = useState(false);
  const [isThankYou, setIsThankYou] = useAtom(isThankYouAtom);
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
      toast("Save", { type: "success" });
      setIsSaving(false);
      return;
    }

    const response = false;

    if (response) {
      toast("Save", { type: "success" });
    }

    setIsSaving(false);
  }

  if (!form) return <></>;
  return (
    <Wrapper>
      <TitleContainer>
        <Flex>
          <TopBarTitle
            css={css`
              color: #707070;
              cursor: pointer;
            `}
            onClick={() => router.back()}
          >
            Builder
          </TopBarTitle>
          <div style={{ margin: "0px 8px 0px 10px" }}>
            {/* <Icon name="navigation-arrow-right" /> */}
          </div>
          <TopBarTitle>{form.name}</TopBarTitle>
        </Flex>
        <TopBarSubTitle>
          {/* <Icon name="fragment-icon" /> */}
          &nbsp;Builder • Created on{" "}
          {dayjs(form.createdAt).format("MMM DD, YYYY @ h:MM a")}
        </TopBarSubTitle>
      </TitleContainer>
      {form.hasThankYouBuilder && (
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
        <StyledButton
          inverted
          css={ButtonCss}
          onClick={() => {
            window.open(
              `${window.location.href
                .split("form-builder")
                .join("form-builder-preview")}&preview=true${
                isThankYou ? "&thankyou" : ""
              }`
            );
          }}
        >
          Preview
        </StyledButton>

        <StyledButton
          css={ButtonCss}
          isLoading={isSaving}
          onClick={handleClickSave}
        >
          Save
        </StyledButton>
      </ButtonsContainer>
    </Wrapper>
  );
}
