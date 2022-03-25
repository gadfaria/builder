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

// { size, variant, color, text, ...props
export const Button = ({ size, variant, color, text, ...props }: any) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <ChakraButton
      ref={(ref) => ref && connect(drag(ref))}
      size={size}
      {...props}
    >
      {text}
    </ChakraButton>
  );
};

export const ButtonSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div>
      <FormControl as="fieldset">
        <FormLabel as="legend">Size</FormLabel>
        <RadioGroup
          defaultValue={props.size}
          onChange={(e) =>
            setProp((props: Record<string, any>) => (props.size = e))
          }
        >
          <HStack spacing="24px">
            <Radio value="xs">Extra Small</Radio>
            <Radio value="sm">Small</Radio>
            <Radio value="md">Medium</Radio>
            <Radio value="lg">Large</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export const ButtonDefaultProps = {
  size: "md",
  text: "Click me",
};

Button.craft = {
  props: ButtonDefaultProps,
  related: {
    settings: ButtonSettings,
  },
};
