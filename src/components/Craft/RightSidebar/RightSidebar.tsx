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
    // <Box bgcolor="rgba(0, 0, 0, 0.06)" mt={2} px={2} py={2}>
    //   <Grid container direction="column" spacing={0}>
    //     <Grid item>
    //       <Box pb={2}>
    //         <Grid container alignItems="center">
    //           <Grid item xs>
    //             <Typography variant="subtitle1">Selected</Typography>
    //           </Grid>
    //           <Grid item>
    //             <Chip
    //               size="small"
    //               color="primary"
    //               label={selected.name}
    //               data-cy="chip-selected"
    //             />
    //           </Grid>
    //         </Grid>
    //       </Box>
    //     </Grid>
    // <div data-cy="settings-panel">
    //   {selected.settings && React.createElement(selected.settings)}
    // </div>
    // {selected.isDeletable ? (
    //   <MaterialButton
    //     variant="contained"
    //     color="default"
    //     onClick={() => {
    //       actions.delete(selected.id);
    //     }}
    //   >
    //     Delete
    //   </MaterialButton>
    // ) : null}
    //   </Grid>
    // </Box>
    <></>
  );
};
