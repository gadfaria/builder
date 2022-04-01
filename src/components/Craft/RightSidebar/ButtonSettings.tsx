/** @jsxImportSource @emotion/react */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Input,
  Select,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { DEFAULT_COLOR } from "../utils/consts";
import ColorInput from "./InputColor";
import InputNumber from "./InputNumber";

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0px;
  color: #333333;
  margin-bottom: 8px;
`;

const Line = styled.div`
  margin: 20px 0px;
`;

interface Props {
  text: string;
  width: number;
  height: number;
  setValue: (value: string | number, key: string) => void;
}

export default function ButtonSettings({
  height,
  width,
  text,
  setValue,
}: Props) {
  return (
    <Accordion width="100%" allowMultiple>
      <AccordionItem>
        <AccordionButton
          _focus={{ outline: "none" }}
          className="accordion-button"
          padding="10px"
        >
          <div className="title-button">Button</div>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel borderBottom="1px solid #EBEBEB">
          <InputNumber
            label="Width (px)"
            value={width || 0}
            handleValueChange={(vle) => setValue(`${vle}px`, "width")}
          />

          <Line />

          <InputNumber
            label="Height (px)"
            value={height || 0}
            handleValueChange={(vle) => setValue(`${vle}px`, "height")}
          />

          <Title>Button Text</Title>
          <Input
            value={text || ""}
            focusBorderColor={DEFAULT_COLOR}
            onChange={(e) => {
              setValue(e.target.value, "text");
            }}
          />

          <Line />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
