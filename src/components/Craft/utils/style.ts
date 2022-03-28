import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { DEFAULT_COLOR } from "./consts";

export const craftStyle = css`
  h1 {
    font-size: 2em;
  }
  h2 {
    font-size: 1.5em;
  }
  h3 {
    font-size: 1.15em;
  }

  .ProseMirror:focus {
    outline: none;
  }

  *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  *::-webkit-scrollbar-track {
    box-shadow: inset 0 0 1px transparent;
  }

  *::-webkit-scrollbar-thumb {
    background-color: rgba(168, 168, 168, 0.3);
    border-radius: 5px;
  }

  *::-webkit-scrollbar-thumb:hover {
    background-color: rgba(168, 168, 168, 0.7);
  }

  @tailwind base;
  @tailwind components;
  @import url("https://use.typekit.net/mpa1wkh.css");
  @tailwind utilities;

  .component-selected {
    @apply relative;
  }
  .component-selected::after {
    content: " ";
    @apply border-primary border border-dashed w-full h-full absolute left-0 top-0 pointer-events-none block;
  }

  .transition {
    transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  }

  #carbonads * {
    margin: initial;
    padding: initial;
  }

  #carbonads {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial,
      sans-serif;

    padding: 10px 0.5rem;
    border-top: 1px solid rgb(0 0 0 / 6%);
  }
`;

export const notSelect = css`
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
`;

export const customTooltip = css`
  opacity: 1 !important;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px !important;
  padding: 8px 12px !important;
  ${notSelect}
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export const TooltipText = styled.span`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0px;
  color: #ffffff;
`;

export const buttonDimensionsChakra = {
  width: 100,
  height: 42,
};

export const buttonOutlineChakra = {
  bgColor: "white",
  color: DEFAULT_COLOR,
  borderColor: DEFAULT_COLOR,
  borderWidth: 1,
  _hover: { opacity: 0.5 },
};

export const buttonSolidChakra = {
  bgColor: DEFAULT_COLOR,
  color: "white",
  _hover: { bg: DEFAULT_COLOR + "80" },
};

export const buttonErrorSolidChakra = {
  bgColor: "#FF3333",
  color: "white",
  _hover: { bg: "#FF333380" },
};
