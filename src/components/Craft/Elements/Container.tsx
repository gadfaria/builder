import React from "react";
import { Resizer } from "./Resizer";

export type ContainerProps = {
  background: string;
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
  children: React.ReactNode;
};

const defaultProps = {
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  marginTop: 0,
  marginLeft: 0,
  marginBottom: 0,
  marginRight: 0,
  paddingTop: 0,
  paddingLeft: 0,
  paddingBottom: 0,
  paddingRight: 0,
  width: "100%",
  height: "auto",
};

export const Container = (props: Partial<ContainerProps>) => {
  props = {
    ...defaultProps,
    ...props,
  };
  const {
    flexDirection,
    alignItems,
    justifyContent,
    background,
    marginTop,
    marginLeft,
    marginBottom,
    marginRight,
    paddingTop,
    paddingLeft,
    paddingBottom,
    paddingRight,
    children,
  } = props;
  return (
    <Resizer
      propKey={{ width: "width", height: "height" }}
      style={{
        justifyContent,
        flexDirection,
        alignItems,
        background: background,
        marginTop,
        marginLeft,
        marginBottom,
        marginRight,
        paddingTop,
        paddingLeft,
        paddingBottom,
        paddingRight,
        flex: "unset",
      }}
    >
      {children}
    </Resizer>
  );
};

Container.craft = {
  displayName: "Container",
  props: defaultProps,
  rules: {
    canDrag: () => true,
  },
  // related: {
  //   toolbar: ContainerSettings,
  // },
};
