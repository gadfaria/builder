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
import InputRange from "./InputRange";

const Line = styled.div`
  margin: 20px 0px;
`;

interface Props {
  marginTop: number;
  marginBottom: number;
  marginRight: number;
  marginLeft: number;
  setValue: (value: string | number, key: string) => void;
}

export default function MarginSettings({
  marginTop,
  marginBottom,
  marginRight,
  marginLeft,
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
          <div className="title-button">Margin</div>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel borderBottom="1px solid #EBEBEB">
          <InputNumber
            label="Top"
            value={marginTop || 0}
            handleValueChange={(vle) => setValue(vle, "marginTop")}
          />
          <Line />

          <InputNumber
            label="Bottom"
            value={marginBottom || 0}
            handleValueChange={(vle) => setValue(vle, "marginBottom")}
          />
          <Line />

          <InputNumber
            label="Right"
            value={marginRight || 0}
            handleValueChange={(vle) => setValue(vle, "marginRight")}
          />
          <Line />

          <InputNumber
            label="Left"
            value={marginLeft || 0}
            handleValueChange={(vle) => setValue(vle, "marginLeft")}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
