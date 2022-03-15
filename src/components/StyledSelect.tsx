/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import useClickOutside from "../hooks/useClickOutside";
import { getScrollParent } from "../utils/DOMHelper";
interface ContainerProps {
  disabled?: boolean;
}

export interface Option {
  name: string;
  value?: string | null;
  id: string;
}

const Container = styled.div<ContainerProps>`
  width: 100%;
  height: 40px;
  color: #2f2f2f;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #dddddd;
  background-color: #ffffff;
  height: 40px;
`;

const Arrow = styled.div`
  position: absolute;
  top: 15px;
  right: 10px;
`;

interface DropViewProps {
  position: { left: number; top: number };
  width: number;
  offset: number;
}

const DropView = styled.div<DropViewProps>`
  position: fixed;
  background: #fff;
  z-index: 20;
  top: ${(props) =>
    props.offset > 0 ? `auto` : `${props.position.top + 5}px`};
  bottom: ${(props) => (props.offset > 0 ? `${props.offset + 5}px` : "auto")};
  width: ${(props) => props.width}px;
  max-height: 320px;
  flex: 1;
  border-radius: 5px;
  box-shadow: 0px 3px 6px #00000026;
  overflow-y: auto;
  padding: 10px 0px;
  z-index: 10;
`;

interface DropItemProps {
  preSelected: boolean;
  selected: boolean;
}

const DropItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  color: ${(props: DropItemProps) => (props.selected ? "#fff" : "#2f2f2f")};

  background-color: ${(props: DropItemProps) =>
    props.selected ? "#fb972e" : props.preSelected ? "#ebebeb" : "#fff"};
`;

const Name = styled.div`
  font-size: 16px;
  padding: 10px;
`;

interface Props {
  options: Option[];
  selectedOption: Option | undefined;
  handleSelectedOption: (vle: Option) => void;
  disabled?: boolean;
  above?: boolean;
  customCss?: any;
}

const NO_OPTION = null;

/**
 * Our own Select implementation. DropView is the Select body when expanded,
 * and it's position: fixed.
 *
 * It get's it's `top` and `left` properties calculated whenever I click on it's,
 * sibling input. Triggering it's view.
 * @param props
 */

export default function StyledSelect(props: Props): JSX.Element {
  const {
    options,
    selectedOption,
    handleSelectedOption,
    above,
    customCss,
    disabled,
  } = props;

  /**
   * Select functionality
   */
  const [openDropView, setOpenDropView] = useState<boolean>(false);
  const [preSelectedOption, setPreSelectedSearchId] = useState<
    string | typeof NO_OPTION
  >(NO_OPTION);

  const [offsetPopover, setOffsetPopover] = useState(0);

  /**
   * Refs to keep track
   */
  const wrapperRef = useClickOutside(() => setOpenDropView(false));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropViewRef = useRef<HTMLDivElement | null>(null);

  // Ref so we're able to scroll the items into view
  const dropItemRefs = useRef<
    {
      id: string;
      element: HTMLDivElement | null;
    }[]
  >([]);

  const [dropviewPosition, setDropViewPosition] = useState<{
    left: number;
    top: number;
  }>({
    left: 0,
    top: 0,
  });
  const [dropViewWidth, setDropViewWidth] = useState<number>(0);

  // Scroll drop view to the selected option in start
  function scrollViewToSelected(): void {
    const selectedDropRef = dropItemRefs.current.find(
      (d) => d.id === selectedOption?.id
    );

    if (selectedDropRef && selectedDropRef.element) {
      selectedDropRef.element.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "start",
      });
    }
  }

  useEffect(() => {
    if (openDropView) scrollViewToSelected();
  }, [openDropView]);

  function updateDropViewPosition() {
    const elementBoundingRect = (
      wrapperRef.current as HTMLDivElement
    ).getBoundingClientRect();

    setDropViewPosition({
      top: elementBoundingRect.top + elementBoundingRect.height,
      left: elementBoundingRect.left,
    });

    setDropViewWidth(elementBoundingRect.width);
  }

  useEffect(() => {
    if (!dropViewRef.current || !wrapperRef.current) return;

    const elementBoundingRect = (
      dropViewRef.current as HTMLDivElement
    ).getBoundingClientRect();

    const containerBoundingRect = (
      wrapperRef.current as HTMLDivElement
    ).getBoundingClientRect();

    let bottom = elementBoundingRect.bottom;

    if (offsetPopover !== 0)
      bottom =
        bottom + elementBoundingRect.height + containerBoundingRect.height;

    if (bottom >= 0 && bottom >= window.innerHeight) {
      setOffsetPopover(window.innerHeight - containerBoundingRect.top);
    } else {
      setOffsetPopover(0);
    }
  }, [dropViewRef, openDropView, selectedOption]);

  function onInputClicked() {
    updateDropViewPosition();
    setOpenDropView((openDrop) => !openDrop);
  }

  useEffect(() => {
    if (!openDropView) return () => {};

    function closeDropView() {
      setOpenDropView(false);
    }

    const scrollParent = getScrollParent(
      containerRef.current,
      containerRef.current
    );

    if (!scrollParent) return () => {};

    scrollParent.addEventListener("scroll", closeDropView);

    return () => {
      scrollParent.removeEventListener("scroll", closeDropView);
    };
  }, [wrapperRef, containerRef, openDropView]);

  useEffect(() => {
    function closeDropView() {
      setOpenDropView(false);
    }

    window.addEventListener("resize", closeDropView);
    return () => window.removeEventListener("resize", closeDropView);
  }, [wrapperRef, containerRef]);

  useEffect(() => {
    setOpenDropView(false);
  }, [selectedOption]);

  return (
    <Container ref={containerRef} css={customCss} disabled={disabled}>
      <InputContainer
        ref={wrapperRef}
        onClick={() => !disabled && onInputClicked()}
      >
        {selectedOption && <Name>{selectedOption.name}</Name>}

        <Arrow>{/* arrow icon */}</Arrow>
      </InputContainer>

      {openDropView && (
        <DropView
          position={dropviewPosition}
          offset={offsetPopover}
          width={dropViewWidth}
          ref={dropViewRef}
        >
          {options.map((option, index) => {
            return (
              <DropItem
                key={`option_${option.id}`}
                ref={(r) => {
                  dropItemRefs.current[index] = {
                    id: option.id,
                    element: r,
                  };
                }}
                onMouseEnter={() => setPreSelectedSearchId(option.id)}
                onMouseLeave={() => setPreSelectedSearchId(NO_OPTION)}
                onMouseDown={() => {
                  handleSelectedOption(option);
                  setPreSelectedSearchId(NO_OPTION);
                }}
                preSelected={preSelectedOption === option.id}
                selected={selectedOption?.id === option.id}
              >
                <Name>{option.name}</Name>
              </DropItem>
            );
          })}
        </DropView>
      )}
    </Container>
  );
}
