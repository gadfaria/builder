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
  width: number;
  setValue: (value: string | number, key: string) => void;
}

export default function ImageSettings({
  width,
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
          <div className="title-button">Image</div>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel borderBottom="1px solid #EBEBEB">
          <InputRange
            label="Width"
            max={100}
            min={0}
            value={width}
            handleValueChange={(vle) => setValue(vle, "width")}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
