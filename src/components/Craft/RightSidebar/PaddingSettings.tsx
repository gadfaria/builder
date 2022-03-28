/** @jsxImportSource @emotion/react */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import InputRange from "./InputRange";

const Line = styled.div`
  margin: 20px 0px;
`;

interface Props {
  paddingTop: number;
  paddingBottom: number;
  paddingRight: number;
  paddingLeft: number;
  setValue: (value: string | number, key: string) => void;
}

export default function PaddingSettings({
  paddingTop,
  paddingBottom,
  paddingRight,
  paddingLeft,
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
          <div className="title-button">Padding</div>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel borderBottom="1px solid #EBEBEB">
          <InputRange
            label="Top"
            max={100}
            min={0}
            value={paddingTop}
            handleValueChange={(vle) => setValue(vle, "paddingTop")}
          />
          <Line />
          <InputRange
            label="Bottom"
            max={100}
            min={0}
            value={paddingBottom}
            handleValueChange={(vle) => setValue(vle, "paddingBottom")}
          />
          <Line />
          <InputRange
            label="Right"
            max={100}
            min={0}
            value={paddingRight}
            handleValueChange={(vle) => setValue(vle, "paddingRight")}
          />
          <Line />
          <InputRange
            label="Left"
            max={100}
            min={0}
            value={paddingLeft}
            handleValueChange={(vle) => setValue(vle, "paddingLeft")}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
