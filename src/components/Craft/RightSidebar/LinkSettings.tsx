/** @jsxImportSource @emotion/react */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import {
  DEFAULT_COLOR_LINK,
  DEFAULT_VISITED_COLOR_LINK,
} from "../utils/consts";
import ColorInput from "./InputColor";

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
  linkColor: string;
  visitedLinkColor: string;
  setValue: (value: string | number, key: string) => void;
}

export default function LinkSettings({
  linkColor,
  visitedLinkColor,
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
          <div className="title-button">Link</div>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel borderBottom="1px solid #EBEBEB">
          <ColorInput
            label="Link Color"
            color={linkColor || DEFAULT_COLOR_LINK}
            handleChangeColor={(vle) => vle && setValue(vle, "linkColor")}
          />

          <Line />

          <ColorInput
            label="Visited Link Color"
            color={visitedLinkColor || DEFAULT_VISITED_COLOR_LINK}
            handleChangeColor={(vle) =>
              vle && setValue(vle, "visitedLinkColor")
            }
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
