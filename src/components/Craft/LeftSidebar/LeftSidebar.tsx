/** @jsxImportSource @emotion/react */
import { Element } from "@craftjs/core";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import ReactTooltip from "react-tooltip";
import { Button } from "../Elements/Button";
import { Container } from "../Elements/Container/Container";
import { Image } from "../Elements/Image";
import { defaultTextProps, Text } from "../Elements/Text/Text";
import useClickOutside from "../hooks/useClickOutside";
import useMediaQuery from "../hooks/useMediaQuery";
import { DEFAULT_COLOR } from "../utils/consts";
import { customTooltip, TooltipText } from "../utils/style";
import { Types } from "../utils/types";
import LeftSidebarCard from "./LeftSidebarCard";

const SideBarButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  width: 30px;
  height: 30px;
  margin: 20px;
  z-index: 1;

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

const Sidebar = styled(motion.div)`
  width: 100%;
  max-width: 300px;
  height: 100%;
  background-color: #fff;
  z-index: 2;
  border-right: 1px solid rgba(0, 0, 0, 0.16);
  position: relative;

  @media (max-width: 1680px) {
    position: absolute;
    bottom: 0;
  }
`;

const SideBarCards = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 115px);
  grid-gap: 20px;
  justify-content: center;
`;

export const SideBarText = styled.div`
  font-size: 14px;
  letter-spacing: 0.35px;
  color: #979797;
  font-weight: 600;
  margin: 25px 25px 18px;
`;

export interface Type {
  label: string;
  type: Types;
  icon: string;
  component: JSX.Element;
}

const TYPES: Type[] = [
  {
    label: "Text",
    type: "TEXT",
    icon: "../icons/builder/text.svg",
    component: <Text {...defaultTextProps} />,
  },
  {
    label: "Button",
    type: "BUTTON",
    icon: "../icons/builder/text.svg",
    component: <Button />,
  },
  {
    label: "Image",
    type: "IMAGE",
    icon: "../icons/builder/image.svg",
    component: <Image />,
  },
  {
    label: "Column",
    type: "COLUMN",
    icon: "../icons/builder/text.svg",
    component: (
      <Element canvas is={Container} custom={{ displayName: "Container" }} />
    ),
  },
];

const variants = {
  open: {
    // opacity: 1,
    display: "block",
  },
  closed: {
    // opacity: 0,
    x: -300,
    transitionEnd: {
      display: "none",
    },
  },
};

export default function LeftSidebar() {
  const isLargerThan1680 = useMediaQuery("(min-width: 1680px)");
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useClickOutside(() => setShowSidebar(false));

  return (
    <>
      <SideBarButton
        css={css``}
        onClick={(e) => {
          setShowSidebar(!showSidebar);
          e.stopPropagation();
        }}
        data-tip
        data-for="left-side-bar-element"
      >
        <BsLayoutTextSidebarReverse />
        <ReactTooltip
          id="left-side-bar-element"
          place="right"
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
        <SideBarText>FORM ELEMENTS</SideBarText>
        <SideBarCards>
          {TYPES.map((type) => (
            <LeftSidebarCard key={type.type} {...type} />
          ))}
        </SideBarCards>
      </Sidebar>
    </>
  );
}
