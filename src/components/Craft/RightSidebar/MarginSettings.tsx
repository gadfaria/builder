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
          <InputRange
            label="Top"
            max={100}
            min={-10}
            value={marginTop}
            handleValueChange={(vle) => setValue(vle, "marginTop")}
          />
          <Line />
          <InputRange
            label="Bottom"
            max={100}
            min={-10}
            value={marginBottom}
            handleValueChange={(vle) => setValue(vle, "marginBottom")}
          />
          <Line />
          <InputRange
            label="Right"
            max={100}
            min={-10}
            value={marginRight}
            handleValueChange={(vle) => setValue(vle, "marginRight")}
          />
          <Line />
          <InputRange
            label="Left"
            max={100}
            min={-10}
            value={marginLeft}
            handleValueChange={(vle) => setValue(vle, "marginLeft")}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
