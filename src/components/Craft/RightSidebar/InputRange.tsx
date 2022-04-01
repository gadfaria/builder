/** @jsxImportSource @emotion/react */
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { DEFAULT_COLOR } from "../utils/consts";

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0px;
  color: #333333;
  margin-bottom: 8px;
`;

const Range = styled.div`
  width: 100%;
  padding: 0px 10px;
`;

interface Props {
  value: number;
  handleValueChange: (vle: number) => void;
  label: string;
  max: number;
  min: number;
}

export default function InputRange(props: Props) {
  return (
    <>
      <Label>
        {props.label}
        <NumberInput
          w={props.max < 1000 ? "75px" : "85px"}
          value={props.value}
          onChange={(vle) => {
            let value = parseInt(vle);
            if (value > props.max) value = props.max;
            if (value < props.min) value = props.min;
            props.handleValueChange(value);
          }}
        >
          <NumberInputField _focus={{ borderColor: DEFAULT_COLOR }} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Label>
      <Range>
        <Slider
          value={props.value}
          aria-label="slider"
          max={props.max || 100}
          min={props.min || 0}
          onChange={(vle) => {
            props.handleValueChange(vle);
          }}
        >
          <SliderTrack h="10px" borderRadius="8px" bg="#EEEEEE">
            <SliderFilledTrack bg={DEFAULT_COLOR} />
          </SliderTrack>
          <SliderThumb
            bg={DEFAULT_COLOR}
            h="20px"
            w="20px"
            _focus={{ outline: "none" }}
          />
        </Slider>
      </Range>
    </>
  );
}
