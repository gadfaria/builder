/** @jsxImportSource @emotion/react */
import { useEditor, useNode } from "@craftjs/core";
import React from "react";
import BackgroundColor from "../../RightSidebar/BackgroundColor";
import BorderSettings from "../../RightSidebar/BorderSettings";
import ContainerSettings from "../../RightSidebar/ContainerSettings";
import MarginSettings from "../../RightSidebar/MarginSettings";
import PaddingSettings from "../../RightSidebar/PaddingSettings";
import { SettingsContainer } from "../../RightSidebar/RightSidebar";
import SizeSettings from "../../RightSidebar/SizeSettings";
import { Resizer } from "./Resizer";

export type Props = {
  backgroundColor: string;
  flexDirection: string;
  alignItems: string;
  justifyContent: string;
  width: string;
  height: string;
  marginTop: number;
  marginLeft: number;
  marginBottom: number;
  marginRight: number;
  paddingTop: number;
  paddingLeft: number;
  paddingBottom: number;
  paddingRight: number;
  borderWidth: number;
  borderRadius: number;
  borderStyle: string;
  borderColor: string;
  children: React.ReactNode;
};

const defaultContainerProps = {
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  marginTop: 0,
  marginLeft: 0,
  marginBottom: 5,
  marginRight: 0,
  paddingTop: 40,
  paddingLeft: 40,
  paddingBottom: 40,
  paddingRight: 40,
  borderWidth: 0,
  borderRadius: 0,
  borderStyle: "none",
  borderColor: "#e2e8f0",
  width: "100%",
  height: "auto",
};

export const Container = (props: Partial<Props>) => {
  props = {
    ...defaultContainerProps,
    ...props,
  };
  const {
    flexDirection,
    alignItems,
    justifyContent,
    backgroundColor,
    marginTop,
    marginLeft,
    marginBottom,
    marginRight,
    paddingTop,
    paddingLeft,
    paddingBottom,
    paddingRight,
    borderColor,
    borderWidth,
    borderRadius,
    borderStyle,
    children,
  } = props;

  const { enabled } = useEditor((state, query) => ({
    enabled: state.options.enabled,
  }));
  return (
    <Resizer
      propKey={{ width: "width", height: "height" }}
      className={enabled && "container-resizer"}
      style={{
        display: "flex",
        position: "relative",
        justifyContent,
        flexDirection,
        alignItems,
        backgroundColor,
        marginTop,
        marginLeft,
        marginBottom,
        marginRight,
        paddingTop,
        paddingLeft,
        paddingBottom,
        paddingRight,
        borderColor,
        borderWidth,
        borderRadius,
        borderStyle,
      }}
    >
      {children}
    </Resizer>
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
    width: node.data.props.width,
    height: node.data.props.height,
    paddingTop: node.data.props.paddingTop,
    paddingLeft: node.data.props.paddingLeft,
    paddingBottom: node.data.props.paddingBottom,
    paddingRight: node.data.props.paddingRight,
    marginTop: node.data.props.marginTop,
    marginLeft: node.data.props.marginLeft,
    marginBottom: node.data.props.marginBottom,
    marginRight: node.data.props.marginRight,
    backgroundColor: node.data.props.backgroundColor,
    borderWidth: node.data.props.borderWidth,
    borderRadius: node.data.props.borderRadius,
    borderStyle: node.data.props.borderStyle,
    borderColor: node.data.props.borderColor,
  }));

  return (
    <SettingsContainer>
      <BackgroundColor
        backgroundColor={props.backgroundColor}
        setValue={(value: string | undefined, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />

      <SizeSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />

      <ContainerSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />

      <MarginSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />

      <PaddingSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />

      <BorderSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />
    </SettingsContainer>
  );
};

Container.craft = {
  displayName: "Container",
  props: defaultContainerProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: Settings,
  },
};
