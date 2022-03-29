/** @jsxImportSource @emotion/react */
import { Button, Center, Flex, Spacer } from "@chakra-ui/react";
import { useEditor } from "@craftjs/core";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { BsLayoutTextSidebar } from "react-icons/bs";
import ReactTooltip from "react-tooltip";
import useClickOutside from "../hooks/useClickOutside";
import useMediaQuery from "../hooks/useMediaQuery";
import { DEFAULT_COLOR } from "../utils/consts";
import {
  buttonErrorSolidChakra,
  customTooltip,
  TooltipText,
} from "../utils/style";

const SideBarButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  width: 30px;
  height: 30px;
  margin: 20px;
  z-index: 1;
  right: 0;

  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 3px;

  cursor: pointer;

  transition: border-color 0.3s;

  svg {
    color: rgba(0, 0, 0, 0.16);

    transition: color 0.3s;
  }

  :hover {
    border-color: ${DEFAULT_COLOR};

    svg {
      color: ${DEFAULT_COLOR};
    }
  }
`;

export const SideBarText = styled.div`
  font-size: 14px;
  letter-spacing: 0.35px;
  color: #979797;
  font-weight: 600;
`;

export const SettingsContainer = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  .accordion-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: none;
    background: transparent;
    cursor: pointer;
  }
  .title-button {
    font-size: 16px;
    font-weight: 600;
    color: #3e3e3e;
  }
`;

const Sidebar = styled(motion.div)`
  width: 100%;
  max-width: 300px;
  height: 100%;
  background-color: #fff;
  z-index: 2;
  border-left: 1px solid rgba(0, 0, 0, 0.16);
  position: relative;

  @media (max-width: 1680px) {
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;

export default function RightSidebar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useClickOutside(() => setShowSidebar(false));
  const isLargerThan1680 = useMediaQuery("(min-width: 1680px)");

  const { actions, selected, enabled } = useEditor((state, query) => {
    const currentNodeId = query.getEvent("selected").last();
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected,
      enabled: state.options.enabled,
    };
  });

  const variants = {
    open: {
      // opacity: 1,
      display: "block",
    },
    closed: {
      // opacity: 0,
      x: 300,
      transitionEnd: {
        display: "none",
      },
    },
  };

  if (!selected) return <></>;
  return (
    <>
      <SideBarButton
        css={css``}
        onClick={(e) => {
          setShowSidebar(!showSidebar);
          e.stopPropagation();
        }}
        data-tip
        data-for="right-side-bar-element"
      >
        <BsLayoutTextSidebar />
        <ReactTooltip
          id="right-side-bar-element"
          place="left"
          effect="solid"
          backgroundColor="#333333"
          css={customTooltip}
        >
          <TooltipText>Element sidebar</TooltipText>
        </ReactTooltip>
      </SideBarButton>

      <Sidebar
        ref={sidebarRef}
        animate={isLargerThan1680 || showSidebar ? "open" : "closed"}
        variants={variants}
        transition={{
          bounce: false,
        }}
      >
        <Flex m={25}>
          <SideBarText>BUILDER STYLE</SideBarText>
          <Spacer />
          <SideBarText>{selected.name}</SideBarText>
        </Flex>

        {selected.settings && React.createElement(selected.settings)}

        {selected.isDeletable && (
          <Center>
            <Button
              {...buttonErrorSolidChakra}
              onClick={() => {
                actions.delete(selected.id);
              }}
            >
              Delete
            </Button>
          </Center>
        )}
      </Sidebar>
    </>
  );
}
