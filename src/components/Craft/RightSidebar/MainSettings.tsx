/** @jsxImportSource @emotion/react */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import styled from "@emotion/styled";

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

interface Props {
  justifyContent: string;
  alignItems: string;
  setValue: (value: string | number, key: string) => void;
}

export default function MainSettings({
  justifyContent,
  alignItems,
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
          <div className="title-button">Main</div>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel borderBottom="1px solid #EBEBEB">
          <FormControl as="fieldset">
            <FormLabel as="legend">Justify Content</FormLabel>
            <RadioGroup
              defaultValue={justifyContent}
              onChange={(e) => setValue(e, "justifyContent")}
            >
              <HStack spacing="24px">
                <Radio value="flex-start">Flex Start</Radio>
                <Radio value="center">Center</Radio>
                <Radio value="flex-end">Flex End</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <Line />

          <FormControl as="fieldset">
            <FormLabel as="legend">Align Items</FormLabel>
            <RadioGroup
              defaultValue={alignItems}
              onChange={(e) => setValue(e, "alignItems")}
            >
              <HStack spacing="24px">
                <Radio value="flex-start">Flex Start</Radio>
                <Radio value="center">Center</Radio>
                <Radio value="flex-end">Flex End</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
