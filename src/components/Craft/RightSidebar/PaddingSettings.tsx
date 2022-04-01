/** @jsxImportSource @emotion/react */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import InputNumber from "./InputNumber";

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
          <InputNumber
            label="Top"
            value={paddingTop || 0}
            handleValueChange={(vle) => setValue(vle, "paddingTop")}
          />
          <Line />

          <InputNumber
            label="Bottom"
            value={paddingBottom || 0}
            handleValueChange={(vle) => setValue(vle, "paddingBottom")}
          />
          <Line />

          <InputNumber
            label="Right"
            value={paddingRight || 0}
            handleValueChange={(vle) => setValue(vle, "paddingRight")}
          />
          <Line />

          <InputNumber
            label="Left"
            value={paddingLeft || 0}
            handleValueChange={(vle) => setValue(vle, "paddingLeft")}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
