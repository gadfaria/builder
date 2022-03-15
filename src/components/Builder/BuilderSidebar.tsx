/** @jsxImportSource @emotion/react */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  CheckboxGroup,
  HStack,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { encode } from "base64-arraybuffer";
import { PrimitiveAtom, useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { ItemType, SideBarText } from "./Builder";
import StyledInput from "./StyledInput";
import StyledSelect from "./StyledSelect";
import {
  DEFAULT_CHECKBOX_COLOR,
  DEFAULT_COLOR_LINK,
  DEFAULT_VISITED_COLOR_LINK,
} from "./BuilderConsts";
import FormColorCard from "./ColorCard";
import FormInputNumber from "./InputFontSize";
import FormInputRange from "./InputRange";
import StyledAutocompleteSelect from "./AutoCompleteSelect";
const Container = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  .accordion-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: none;
    background: transparent;
    cursor: pointer;
  }
  .title-button {
    font-size: 16px;
    font-weight: 600;
    color: #3e3e3e;
  }
`;

const Wrapper = styled.div`
  margin: 0px 25px 30px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0px;
  color: #333333;
  margin-bottom: 8px;
`;

const BackgroundImage = styled.div<{ hasImage: boolean }>`
  width: 250px;
  height: 150px;
  position: relative;
  background: #fff2e5;
  color: #fb972e;
  border-radius: 4px;
  overflow: hidden;
  transition: opacity 0.3s;

  ${(props) =>
    !props.hasImage &&
    css`
      border: 1px dashed #fb972e;
      cursor: pointer;
      :hover {
        opacity: 0.7;
        transition: opacity 0.3s;
      }
    `}
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const BackgroundImageIcons = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  cursor: pointer;
  svg {
    color: #000;
    transition: color 0.3s;
  }
  :hover {
    svg {
      color: #fb972e;
      transition: color 0.3s;
    }
  }
`;

const BackgroundText = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0px;

  svg {
    color: #fb972e;
    margin-right: 4px;
  }
`;

const Line = styled.div`
  margin: 20px 0px;
`;

const BORDER_STYLE_VALUES = [
  { id: "none", value: "None", name: "None" },
  { id: "hidden", value: "Hidden", name: "Hidden" },
  { id: "dotted", value: "Dotted", name: "Dotted" },
  { id: "dashed", value: "Dashed", name: "Dashed" },
  { id: "solid", value: "Solid", name: "Solid" },
  { id: "double", value: "Double", name: "Double" },
  { id: "groove", value: "Groove", name: "Groove" },
  { id: "ridge", value: "Ridge", name: "Ridge" },
  { id: "inset", value: "Inset", name: "Inset" },
  { id: "outset", value: "Outset", name: "Outset" },
];

const FONTS = [
  { name: "Source Sans Pro", value: "Source Sans Pro" },
  { name: "Arial", value: "Arial" },
  { name: "Comic Sans", value: "Comic Sans" },
  { name: "Courier New", value: "Courier New" },
  { name: "Georgia", value: "Georgia" },
  { name: "Helvetica", value: "Helvetica" },
  { name: "Palatino", value: "Palatino" },
  { name: "Roboto", value: "Roboto" },
  { name: "Lato", value: "Lato" },
  { name: "Work Sans", value: "Work Sans" },
  { name: "Maven Pro", value: "Maven Pro" },
  { name: "Times New Roman", value: "Times New Roman" },
];

interface Props {
  itemAtom: PrimitiveAtom<ItemType>;
}

const BACKGROUND_OPTIONS = [
  { id: "0", name: "None" },
  { id: "1", name: "Image" },
  { id: "2", name: "Color" },
];
export default function FormBuilderSidebar(props: Props) {
  const { itemAtom } = props;

  const [item, setItem] = useAtom(itemAtom);
  const imageRef = useRef<HTMLInputElement>(null);

  const [autoWidth, setAutoWidth] = useState(!!!item.style?.width);
  const [backgroundOptions, setBackgroundOptions] = useState(
    item?.state?.image
      ? BACKGROUND_OPTIONS[1]
      : item?.style?.backgroundColor
      ? BACKGROUND_OPTIONS[2]
      : BACKGROUND_OPTIONS[0]
  );

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        setItem({
          ...item,
          style: {
            ...item.style,
            backgroundColor: undefined,
          },
          state: {
            ...item.state,
            image: `data:image/png;base64,${encode(binaryStr as ArrayBuffer)}`,
          },
        });
      };
      reader.readAsArrayBuffer(file);
    }
  }

  useEffect(() => {
    if (item.id !== "main") return;

    setBackgroundOptions(
      item?.state?.image
        ? BACKGROUND_OPTIONS[1]
        : item?.style?.backgroundColor
        ? BACKGROUND_OPTIONS[2]
        : BACKGROUND_OPTIONS[0]
    );
  }, [item.id]);

  function handleClearBackground(e: any) {
    e.stopPropagation();
    setItem({
      ...item,
      state: {
        ...item.state,
        image: undefined,
      },
    });
  }

  function handleChangeSelect(option: any) {
    setItem({
      ...item,
      state: {
        ...item.state,
        image: undefined,
      },
      style: {
        ...item.style,
        backgroundColor: undefined,
      },
    });

    setBackgroundOptions(option);
  }

  const lineSpacing = parseFloat(
    parseFloat(item.style?.lineHeight?.split("em").join("") || "1").toFixed(2)
  );

  return (
    <Container>
      {item.id === "main" ? (
        <>
          <SideBarText>FORM STYLE</SideBarText>
          <Wrapper>
            <Title>Background Type</Title>
            <StyledSelect
              options={BACKGROUND_OPTIONS}
              selectedOption={backgroundOptions}
              handleSelectedOption={handleChangeSelect}
            />
          </Wrapper>

          {backgroundOptions.name === "Image" && (
            <>
              <Wrapper>
                <Title>Background Image</Title>
                <BackgroundImage
                  hasImage={!!item.state?.image}
                  onClick={() => {
                    imageRef.current?.click();
                  }}
                >
                  {item.state?.image ? (
                    <>
                      <Image src={item.state?.image} />
                      <BackgroundImageIcons onClick={handleClearBackground}>
                        <FaRegTrashAlt />
                      </BackgroundImageIcons>
                    </>
                  ) : (
                    <BackgroundText>
                      <FiUpload />
                      Upload an image
                    </BackgroundText>
                  )}
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    style={{ display: "none" }}
                  />
                </BackgroundImage>
              </Wrapper>
              <Wrapper>
                <FormInputRange
                  label="Opacity"
                  max={100}
                  min={0}
                  value={parseInt(
                    `${item.style?.opacity ? +item.style?.opacity * 100 : 100}`
                  )}
                  handleValueChange={(vle) =>
                    setItem({
                      ...item,
                      style: {
                        ...item.style,
                        opacity: `${+vle / 100}`,
                      },
                    })
                  }
                />
              </Wrapper>
            </>
          )}
          {backgroundOptions.name === "Color" && (
            <Wrapper>
              <FormColorCard
                isBackground
                label="Background Color"
                color={item.style?.backgroundColor}
                handleChangeColor={(color) => {
                  setItem({
                    ...item,
                    style: { ...item.style, backgroundColor: color },
                    state: {
                      ...item.state,
                      image: undefined,
                    },
                  });
                }}
              />
            </Wrapper>
          )}
          <Wrapper>
            <Checkbox
              size="lg"
              colorScheme="orange"
              defaultIsChecked={!!!item.style?.width}
              checked={autoWidth}
              // @ts-ignore
              onChange={(evt) => {
                if (evt.target.checked === true) {
                  setItem({
                    ...item,
                    style: { ...item.style, width: undefined },
                  });
                }
                setAutoWidth(evt.target.checked);
              }}
            >
              Auto width
            </Checkbox>

            {!autoWidth && (
              <FormInputRange
                label="Width"
                value={
                  parseInt(item.style?.width?.replace("px", "") || "1200") - 4
                }
                min={400}
                max={1200}
                handleValueChange={(vle) =>
                  setItem({
                    ...item,
                    style: { ...item.style, width: `${parseInt(vle) + 4}px` },
                  })
                }
              />
            )}
          </Wrapper>
        </>
      ) : (
        <>
          <SideBarText>ELEMENT STYLE</SideBarText>

          <Wrapper
            css={css`
              margin-bottom: 10px;
            `}
          >
            <FormColorCard
              isBackground
              label="Background Color"
              color={item.style?.backgroundColor}
              handleChangeColor={(color) => {
                setItem({
                  ...item,
                  style: { ...item.style, backgroundColor: color },
                });
              }}
            />
          </Wrapper>

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
                <FormInputRange
                  label="Top"
                  max={100}
                  min={0}
                  value={parseInt(
                    item.style?.paddingTop?.split("%").join("") || "0"
                  )}
                  handleValueChange={(vle) =>
                    setItem({
                      ...item,
                      style: {
                        ...item.style,
                        paddingTop: `${vle}%`,
                      },
                    })
                  }
                />
                <Line />
                <FormInputRange
                  label="Bottom"
                  max={100}
                  min={0}
                  value={parseInt(
                    item.style?.paddingBottom?.split("%").join("") || "0"
                  )}
                  handleValueChange={(vle) =>
                    setItem({
                      ...item,
                      style: {
                        ...item.style,
                        paddingBottom: `${vle}%`,
                      },
                    })
                  }
                />
                <Line />
                <FormInputRange
                  label="Right"
                  max={100}
                  min={0}
                  value={parseInt(
                    item.style?.paddingRight?.split("%").join("") || "0"
                  )}
                  handleValueChange={(vle) =>
                    setItem({
                      ...item,
                      style: {
                        ...item.style,
                        paddingRight: `${vle}%`,
                      },
                    })
                  }
                />
                <Line />
                <FormInputRange
                  label="Left"
                  max={100}
                  min={0}
                  value={parseInt(
                    item.style?.paddingLeft?.split("%").join("") || "0"
                  )}
                  handleValueChange={(vle) =>
                    setItem({
                      ...item,
                      style: {
                        ...item.style,
                        paddingLeft: `${vle}%`,
                      },
                    })
                  }
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

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
                <FormInputRange
                  label="Top"
                  max={100}
                  min={-10}
                  value={parseInt(
                    item.style?.marginTop?.split("%").join("") || "0"
                  )}
                  handleValueChange={(vle) =>
                    setItem({
                      ...item,
                      style: {
                        ...item.style,
                        marginTop: `${vle}%`,
                      },
                    })
                  }
                />
                <Line />
                <FormInputRange
                  label="Bottom"
                  max={100}
                  min={-10}
                  value={parseInt(
                    item.style?.marginBottom?.split("%").join("") || "0"
                  )}
                  handleValueChange={(vle) =>
                    setItem({
                      ...item,
                      style: {
                        ...item.style,
                        marginBottom: `${vle}%`,
                      },
                    })
                  }
                />
                <Line />
                <FormInputRange
                  label="Right"
                  max={100}
                  min={-10}
                  value={parseInt(
                    item.style?.marginRight?.split("%").join("") || "0"
                  )}
                  handleValueChange={(vle) =>
                    setItem({
                      ...item,
                      style: {
                        ...item.style,
                        marginRight: `${vle}%`,
                      },
                    })
                  }
                />
                <Line />
                <FormInputRange
                  label="Left"
                  max={100}
                  min={-10}
                  value={parseInt(
                    item.style?.marginLeft?.split("%").join("") || "0"
                  )}
                  handleValueChange={(vle) =>
                    setItem({
                      ...item,
                      style: {
                        ...item.style,
                        marginLeft: `${vle}%`,
                      },
                    })
                  }
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

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
                <FormInputRange
                  label="Border Width"
                  max={100}
                  min={0}
                  value={parseInt(
                    item.style?.borderWidth?.replace("px", "") || "0"
                  )}
                  handleValueChange={(vle) =>
                    setItem({
                      ...item,
                      style: {
                        ...item.style,
                        borderWidth: `${vle}px`,
                      },
                    })
                  }
                />
                <Line />
                <FormInputRange
                  label="Border Radius"
                  max={100}
                  min={0}
                  value={parseInt(
                    item.style?.borderRadius?.replace("px", "") || "0"
                  )}
                  handleValueChange={(vle) =>
                    setItem({
                      ...item,
                      style: {
                        ...item.style,
                        borderRadius: `${vle}px`,
                      },
                    })
                  }
                />

                <Line />
                <Title>Border style</Title>
                <StyledSelect
                  options={BORDER_STYLE_VALUES}
                  handleSelectedOption={(option: any) => {
                    setItem({
                      ...item,
                      style: { ...item.style, borderStyle: option.id },
                    });
                  }}
                  selectedOption={
                    BORDER_STYLE_VALUES.find(
                      (option) => item.style?.borderStyle === option.id
                    ) || BORDER_STYLE_VALUES[0]
                  }
                />

                <Line />

                <FormColorCard
                  label="Border Color"
                  color={item.style?.borderColor || "#e2e8f0"}
                  handleChangeColor={(color) => {
                    setItem({
                      ...item,
                      style: { ...item.style, borderColor: color },
                    });
                  }}
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {item.type === "FORM" && (
            <Accordion width="100%" allowMultiple>
              <AccordionItem>
                <AccordionButton
                  _focus={{ outline: "none" }}
                  className="accordion-button"
                  padding="10px"
                >
                  <div className="title-button">Form</div>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel borderBottom="1px solid #EBEBEB">
                  <Title>Button Text</Title>
                  <StyledInput
                    value={item.state?.buttonText || "Get Started"}
                    onChange={(evt) => {
                      setItem({
                        ...item,
                        state: {
                          ...item.state,
                          buttonText: evt.target.value,
                        },
                      });
                    }}
                  />
                  <Line />
                  <Title>Required Fields</Title>
                  <CheckboxGroup
                    colorScheme="orange"
                    defaultValue={item.state?.fields || []}
                    onChange={(fields) => {
                      setItem({
                        ...item,
                        state: { ...item.state, fields: fields },
                      });
                    }}
                  >
                    <HStack
                      css={css`
                        display: grid;
                        grid-template-columns: repeat(2, 110px);
                        label {
                          margin-inline-start: 0px !important;
                          -webkit-margin-start: 0px !important;
                        }
                      `}
                    >
                      <Checkbox value="FIRST_NAME">First name</Checkbox>
                      <Checkbox value="LAST_NAME">Last name</Checkbox>
                      <Checkbox value="FULL_NAME">Full name</Checkbox>
                      <Checkbox value="PHONE">Phone</Checkbox>
                    </HStack>
                  </CheckboxGroup>

                  <Line />
                  <FormColorCard
                    label="Form color"
                    color={item.state?.formColor || "#fb972e"}
                    handleChangeColor={(color) => {
                      setItem({
                        ...item,
                        state: { ...item.state, formColor: color },
                      });
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          )}

          {item.type === "CHECKBOX" && (
            <Accordion width="100%" allowMultiple>
              <AccordionItem>
                <AccordionButton
                  _focus={{ outline: "none" }}
                  className="accordion-button"
                  padding="10px"
                >
                  <div className="title-button">Checkbox</div>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel borderBottom="1px solid #EBEBEB">
                  <FormColorCard
                    label="Color"
                    color={item.style?.checkboxColor || DEFAULT_CHECKBOX_COLOR}
                    handleChangeColor={(color?: string) => {
                      setItem({
                        ...item,
                        style: { ...item.style, checkboxColor: color },
                      });
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          )}

          {!["IMAGE", "FORM"].includes(item.type) && (
            <>
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
                    <StyledAutocompleteSelect
                      options={FONTS}
                      selectedOption={
                        FONTS.find(
                          (option) => item.style?.fontFamily === option.value
                        ) || FONTS[0]
                      }
                      onOptionSelect={(option: any) => {
                        setItem({
                          ...item,
                          style: { ...item.style, fontFamily: option.value },
                        });
                      }}
                      placeholder={"Type or select a font family"}
                    />

                    <Line />

                    <FormInputNumber
                      label="Font Size"
                      value={parseInt(
                        item.style?.fontSize?.split("px").join("") || "14"
                      )}
                      handleValueChange={(vle) =>
                        setItem({
                          ...item,
                          style: {
                            ...item.style,
                            fontSize: `${vle < 0 ? 0 : vle}px`,
                          },
                        })
                      }
                    />

                    <Line />

                    <FormColorCard
                      label="Font Color"
                      color={item.style?.color || "#1A202C"}
                      handleChangeColor={(color?: string) => {
                        setItem({
                          ...item,
                          style: { ...item.style, color: color },
                        });
                      }}
                    />

                    <Line />

                    <FormInputNumber
                      interval={0.05}
                      label="Line Spacing"
                      value={lineSpacing}
                      handleValueChange={(vle) =>
                        setItem({
                          ...item,
                          style: {
                            ...item.style,
                            lineHeight: `${vle < 0 ? 0 : vle}em`,
                          },
                        })
                      }
                    />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </>
          )}

          {["TEXT", "FOOTER"].includes(item.type) && (
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
                  <FormColorCard
                    label="Link Color"
                    color={item.style?.linkColor || DEFAULT_COLOR_LINK}
                    handleChangeColor={(color?: string) => {
                      setItem({
                        ...item,
                        style: { ...item.style, linkColor: color },
                      });
                    }}
                  />

                  <Line />

                  <FormColorCard
                    label="Visited Link Color"
                    color={
                      item.style?.visitedLinkColor || DEFAULT_VISITED_COLOR_LINK
                    }
                    handleChangeColor={(color?: string) => {
                      setItem({
                        ...item,
                        style: { ...item.style, visitedLinkColor: color },
                      });
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          )}
        </>
      )}
    </Container>
  );
}