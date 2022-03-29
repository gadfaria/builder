/** @jsxImportSource @emotion/react */
import { useNode } from "@craftjs/core";
import { css } from "@emotion/react";
import React from "react";
import MainSettings from "../RightSidebar/MainSettings";

export const Main = ({
  children,
  alignItems,
  justifyContent,
  ...props
}: any) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
      {...props}
      ref={(ref: HTMLElement) => connect(drag(ref))}
      css={css`
        display: flex;
        flex-direction: column;
        align-items: ${alignItems};
        justify-content: ${justifyContent};
        height: 100%;
        overflow: auto;
        padding: 5px;
      `}
    >
      {children}
    </div>
  );
};

export const Settings = () => {
  const {
    actions: { setProp },
    ...props
  } = useNode((node) => ({
    props: node.data.props,
    justifyContent: node.data.props.justifyContent,
    flexDirection: node.data.props.justifyContent,
    alignItems: node.data.props.alignItems,
  }));

  return (
    <>
      <MainSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />
    </>
  );
};

export const ContainerDefaultProps = {};

Main.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: Settings,
  },
};
