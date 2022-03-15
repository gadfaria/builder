import { css } from "@emotion/react";
import styled from "@emotion/styled";

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