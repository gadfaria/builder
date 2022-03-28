/** @jsxImportSource @emotion/react */
import { useNode } from "@craftjs/core";
import { css } from "@emotion/react";
import React from "react";

export const Main = ({ background, padding, children, ...props }: any) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
      {...props}
      ref={(ref: HTMLElement) => connect(drag(ref))}
      css={css`
        height: 100%;
        overflow: auto;
      `}
    >
      {children}
    </div>
  );
};

export const MainSettings = () => {
  const {
    background,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));

  return <div></div>;
};

export const ContainerDefaultProps = {
  background: "#ffffff",
  padding: 5,
};

Main.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: MainSettings,
  },
};
