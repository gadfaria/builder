/** @jsxImportSource @emotion/react */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  FormControl,
  HStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
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
  flexDirection: string;
  alignItems: string;
  width: string;
  height: string;
  setValue: (value: string | number, key: string) => void;
}

export default function ContainerSettings({
  justifyContent,
  flexDirection,
  alignItems,
  width,
  height,
  setValue,
}: Props) {
  console.log({ flexDirection });
  return (
    <Accordion width="100%" allowMultiple>
      <AccordionItem>
        <AccordionButton
          _focus={{ outline: "none" }}
          className="accordion-button"
          padding="10px"
        >
          <div className="title-button">Alignment</div>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel borderBottom="1px solid #EBEBEB">
          <FormControl as="fieldset">
            <Title>Justify Content</Title>
            <RadioGroup
              defaultValue={justifyContent}
              onChange={(e) => setValue(e, "justifyContent")}
            >
              <HStack
                css={css`
                  * {
                    font-size: 15px !important;
                  }
                `}
              >
                <Radio colorScheme={"orange"} value="flex-start">
                  Flex Start
                </Radio>
                <Radio colorScheme={"orange"} value="center">
                  Center
                </Radio>
                <Radio colorScheme={"orange"} value="flex-end">
                  Flex End
                </Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <Line />

          <FormControl as="fieldset">
            <Title>Flex Direction</Title>
            <RadioGroup
              defaultValue={flexDirection}
              onChange={(e) => setValue(e, "flexDirection")}
            >
              <HStack
                css={css`
                  * {
                    font-size: 15px !important;
                  }
                `}
              >
                <Radio colorScheme={"orange"} value="row">
                  Row
                </Radio>
                <Radio colorScheme={"orange"} value="column">
                  Column
                </Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <Line />

          <FormControl as="fieldset">
            <Title>Align Items</Title>
            <RadioGroup
              defaultValue={alignItems}
              onChange={(e) => setValue(e, "alignItems")}
            >
              <HStack
                css={css`
                  * {
                    font-size: 15px !important;
                  }
                `}
              >
                <Radio colorScheme={"orange"} value="flex-start">
                  Flex Start
                </Radio>
                <Radio colorScheme={"orange"} value="center">
                  Center
                </Radio>
                <Radio colorScheme={"orange"} value="flex-end">
                  Flex End
                </Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
