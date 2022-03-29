/** @jsxImportSource @emotion/react */
import { useNode } from "@craftjs/core";
import { css } from "@emotion/react";
import React from "react";
import BackgroundColor from "../RightSidebar/BackgroundColor";
import MainSettings from "../RightSidebar/MainSettings";

export const Main = ({
  children,
  alignItems,
  justifyContent,
  backgroundColor,
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
        background-color: ${backgroundColor};
        height: 100%;
        overflow: auto;
        padding: 5px;

        * {
          max-width: calc(100vw - 610px);
        }
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
    backgroundColor: node.data.props.backgroundColor,
  }));

  return (
    <>
      <BackgroundColor
        backgroundColor={props.backgroundColor}
        setValue={(value: string | undefined, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />
      <MainSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />
    </>
  );
};

export const ContainerDefaultProps = {
  alignItems: "center",
};

Main.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: Settings,
  },
};
