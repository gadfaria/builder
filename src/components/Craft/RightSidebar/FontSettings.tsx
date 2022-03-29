/** @jsxImportSource @emotion/react */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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

const FONTS = [
  "Source Sans Pro",
  "Arial",
  "Comic Sans",
  "Courier New",
  "Georgia",
  "Helvetica",
  "Palatino",
  "Roboto",
  "Lato",
  "Work Sans",
  "Maven Pro",
  "Times New Roman",
  '"Merriweather"',
];

interface Props {
  fontSize: number;
  fontColor: string;
  lineSpacing: number;
  fontFamily: string;
  setValue: (value: string | number, key: string) => void;
}

export default function FontSettings({
  fontColor,
  fontSize,
  lineSpacing,
  fontFamily,
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
          <div className="title-button">Font</div>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel borderBottom="1px solid #EBEBEB">
          <Title>Font Family</Title>
          <Select
            focusBorderColor={DEFAULT_COLOR}
            onChange={(e) => setValue(e.target.value, "fontFamily")}
            defaultValue={fontFamily || FONTS[0]}
          >
            {FONTS.map((font) => (
              <option value={font}>{font}</option>
            ))}
          </Select>

          <Line />

          <InputNumber
            label="Font Size"
            value={fontSize || 14}
            handleValueChange={(vle) => setValue(vle, "fontSize")}
          />

          <Line />

          <ColorInput
            label="Font Color"
            color={fontColor || "#1A202C"}
            handleChangeColor={(vle) => vle && setValue(vle, "fontColor")}
          />

          <Line />

          <InputNumber
            interval={0.05}
            label="Line Spacing"
            value={+lineSpacing.toFixed(2)}
            handleValueChange={(vle) => setValue(vle, "lineSpacing")}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
