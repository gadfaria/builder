import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { DEFAULT_COLOR } from "../components/Builder/BuilderConsts";

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
