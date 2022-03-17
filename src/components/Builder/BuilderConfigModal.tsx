/** @jsxImportSource @emotion/react */
import {
  Button,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import React, { useState } from "react";
import {
  buttonDimensionsChakra,
  buttonOutlineChakra,
  buttonSolidChakra,
} from "./BuilderStyle";
import { builderAtom } from "./BuilderAtoms";
import { DEFAULT_COLOR } from "./BuilderConsts";
import { IBuilder } from "./BuilderTypes";

interface Props {
  onSave: (builder: IBuilder) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function BuilderConfigModal(props: Props): JSX.Element {
  const [builder] = useAtom(builderAtom);
  const [builderAux, setBuilderAux] = useState(builder as IBuilder);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Configuration</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputGroup>
            <Input
              value={builderAux?.pageTitle}
              focusBorderColor={DEFAULT_COLOR}
              placeholder="Enter page title"
              onChange={(e) =>
                setBuilderAux((b) => ({ ...b, pageTitle: e.target.value }))
              }
            />
          </InputGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            {...buttonOutlineChakra}
            {...buttonDimensionsChakra}
            mr={3}
            onClick={props.onClose}
          >
            Close
          </Button>
          <Button
            {...buttonSolidChakra}
            {...buttonDimensionsChakra}
            onClick={() => {
              props.onSave(builderAux);
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
