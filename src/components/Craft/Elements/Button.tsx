import {
  Button as ChakraButton,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { useNode } from "@craftjs/core";
import React from "react";
import BackgroundColor from "../RightSidebar/BackgroundColor";
import ButtonSettings from "../RightSidebar/ButtonSettings";
import { DEFAULT_COLOR } from "../utils/consts";

export const Button = ({
  variant,
  backgroundColor,
  text,
  width,
  height,
  ...props
}: any) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <ChakraButton
      ref={(ref) => ref && connect(drag(ref))}
      bg={backgroundColor}
      width={`${width}px`}
      color="white"
      height={`${height}px`}
      {...props}
    >
      {text}
    </ChakraButton>
  );
};

export const Settings = () => {
  const {
    actions: { setProp },
    ...props
  } = useNode((node) => ({
    props: node.data.props,
    text: node.data.props.text,
    width: node.data.props.width,
    height: node.data.props.height,
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
      <ButtonSettings
        {...props}
        setValue={(value: string | number, key: string) => {
          setProp((prop: Record<string, any>) => (prop[key] = value), 1000);
        }}
      />
    </>
  );
};

export const ButtonDefaultProps = {
  text: "Click me",
  width: 100,
  height: 46,
  backgroundColor: DEFAULT_COLOR,
};

Button.craft = {
  props: ButtonDefaultProps,
  related: {
    settings: Settings,
  },
};
