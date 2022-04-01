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
import InputColor from "./InputColor";
import InputRange from "./InputRange";

const Line = styled.div`
  margin: 20px 0px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0px;
  color: #333333;
  margin-bottom: 8px;
`;

const BORDERS = [
  "none",
  "hidden",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
];

interface Props {
  borderWidth: number;
  borderRadius: number;
  borderStyle: string;
  borderColor: string;
  setValue: (value: string | number, key: string) => void;
}

export default function BorderSettings({
  borderWidth,
  borderRadius,
  borderStyle,
  borderColor,
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
          <div className="title-button">Border</div>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel borderBottom="1px solid #EBEBEB">
          <InputRange
            label="Border Width"
            max={100}
            min={0}
            value={borderWidth}
            handleValueChange={(vle) => setValue(vle, "borderWidth")}
          />
          <Line />
          <InputRange
            label="Border Radius"
            max={100}
            min={0}
            value={borderRadius}
            handleValueChange={(vle) => setValue(vle, "borderRadius")}
          />

          <Line />
          <Title>Border style</Title>

          <Select
            focusBorderColor={DEFAULT_COLOR}
            onChange={(e) => setValue(e.target.value, "borderStyle")}
            defaultValue={borderStyle}
          >
            {BORDERS.map((border) => (
              <option value={border}>
                {border.charAt(0).toUpperCase() + border.slice(1)}
              </option>
            ))}
          </Select>

          <Line />
          <InputColor
            label="Border Color"
            color={borderColor}
            handleChangeColor={(color) =>
              color && setValue(color, "borderColor")
            }
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
