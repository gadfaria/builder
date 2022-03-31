/** @jsxImportSource @emotion/react */
import { Checkbox } from "@chakra-ui/react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import InputNumber from "./InputNumber";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 25px 30px;
`;

const Line = styled.div`
  margin: 5px 0px;
`;

interface Props {
  width: string;
  height: string;
  setValue: (value: string | number, key: string) => void;
}
export default function SizeSettings({ width, height, setValue }: Props) {
  const [autoWidth, setAutoWidth] = useState(false);
  const [autoHeight, setAutoHeight] = useState(false);

  useEffect(() => {
    setAutoWidth(width === "100%");
    setAutoHeight(height === "auto");
  }, [width, height]);

  return (
    <>
      <Wrapper>
        <Checkbox
          size="lg"
          colorScheme="orange"
          defaultIsChecked={autoWidth}
          isChecked={autoWidth}

          onChange={(evt) => {
            if (evt.target.checked === true) {
              setValue(`100%`, "width");
            }
            setAutoWidth(evt.target.checked);
          }}
        >
          Auto width
        </Checkbox>
        {!autoWidth && (
          <>
            <Line />
            <InputNumber
              label="Width (px)"
              value={parseInt(width.replaceAll("px", "")) || 0}
              handleValueChange={(vle) => setValue(`${vle}px`, "width")}
            />
          </>
        )}

        <Line />

        <Checkbox
          size="lg"
          colorScheme="orange"
          defaultIsChecked={autoHeight}
          isChecked={autoHeight}
          onChange={(evt) => {
            if (evt.target.checked === true) {
              setValue(`auto`, "height");
            }
            setAutoHeight(evt.target.checked);
          }}
        >
          Auto height
        </Checkbox>

        {!autoHeight && (
          <>
            {" "}
            <Line />
            <InputNumber
              label="Height (px)"
              value={parseInt(height.replaceAll("px", "")) || 0}
              handleValueChange={(vle) => setValue(`${vle}px`, "height")}
            />
          </>
        )}
      </Wrapper>
    </>
  );
}
