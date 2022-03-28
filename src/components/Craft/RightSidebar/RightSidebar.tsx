import { Button, Center, Flex, Spacer } from "@chakra-ui/react";
import { useEditor } from "@craftjs/core";
import styled from "@emotion/styled";
import React from "react";
import { buttonErrorSolidChakra } from "../utils/style";

export const SideBarText = styled.div`
  font-size: 14px;
  letter-spacing: 0.35px;
  color: #979797;
  font-weight: 600;
`;

export const SettingsContainer = styled.div`
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

export const RightSidebar = () => {
  const { actions, selected, isEnabled } = useEditor((state, query) => {
    const currentNodeId = query.getEvent("selected").last();
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected,
      isEnabled: state.options.enabled,
    };
  });

  return isEnabled && selected ? (
    <div>
      <Flex m={25}>
        <SideBarText>BUILDER STYLE</SideBarText>
        <Spacer />
        <SideBarText>{selected.name}</SideBarText>
      </Flex>

      {selected.settings && React.createElement(selected.settings)}

      {selected.isDeletable && (
        <Center>
          <Button
            {...buttonErrorSolidChakra}
            onClick={() => {
              actions.delete(selected.id);
            }}
          >
            Delete
          </Button>
        </Center>
      )}
    </div>
  ) : (
    <></>
  );
};
