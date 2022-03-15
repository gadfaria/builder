/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import useClickOutside from "../../hooks/useClickOutside";
import { getScrollParent } from "../../utils/DOMHelper";
import { AutoCompleteSelectItem } from "./AutoCompleteItem";

export interface IOption {
  value: string;
  name: string;
  groupName?: string;
  image?: string;
  icon?: string;
  suffix?: string;
  font?: string;
}

const InputContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Select = styled.div`
  position: absolute;
  cursor: pointer;
  height: 22px;
  width: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  :hover {
    background-color: #22222217;
  }
`;

interface InputProps {
  active: boolean;
  disabled?: boolean;
  withIcon?: boolean;
  withSelect?: boolean;
}

const Input = styled.input<InputProps>`
  width: 100%;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
  padding: 5px;
  color: #383838;
  text-indent: 5px;
  border: 1px solid #dddddd;
  padding-right: 55px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: #ffffff;

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
    `}

  :focus {
    box-shadow: 0px 0px 6px #fb972e4d;
    border: 1px solid #fb972e;
  }

  ${(props) =>
    props.active &&
    css`
      box-shadow: 0px 0px 6px #fb972e4d;
      border: 1px solid #fb972e;
    `}

  &::placeholder {
    font-size: 16px;
    color: #979797;
  }
`;

const AutoCompleteDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  background-color: #ffffff;
  height: 42px;
  position: relative;
`;

interface DropViewProps {
  position: { top: number; left: number };
  width: number;
  offset: number;
}

const StyledAutocompleteList = styled.div<DropViewProps>`
  position: fixed;
  background-color: #fff;
  z-index: 15;
  max-height: 260px;
  flex: 1;
  overflow: auto;
  border-radius: 4px;
  box-shadow: 0px 3px 6px #00000026;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  right: 0;
  padding: 10px 0px;

  top: ${(props) =>
    props.offset > 0 ? `auto` : `${props.position.top + 5}px`};
  left: ${(props) => props.position.left}px;
  width: ${(props) => props.width}px;
  bottom: ${(props) => (props.offset > 0 ? `${props.offset + 5}px` : "auto")};
`;

interface IStyledAutocompleteSelectItemProps {
  name: string;
  value: string;
  font?: string;
  icon?: string;
  suffix?: string;
}
type IStyledAutoCompleteSelectProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  placeholder: string;
  options: IOption[];
  selectedOption: IOption;
  onOptionSelect: (opt: IOption) => void;
  disabled?: boolean;
  resetOnClosedDropview?: boolean;

  selectedValue?: string;
  setSelectedValue?: (text: string) => void;
  renderCustomItemToolbar?: (option: IOption) => JSX.Element;

  startIcon?: JSX.Element;
  removeCheckIcon?: boolean;
  hideNoOption?: boolean;

  noTimer?: boolean;
};

export default function StyledAutocompleteSelect(
  props: IStyledAutoCompleteSelectProps
): JSX.Element {
  const {
    options,
    selectedOption,
    onOptionSelect,
    placeholder,
    disabled,
    resetOnClosedDropview = true,
    startIcon,
    selectedValue,
    setSelectedValue,
    hideNoOption,
    renderCustomItemToolbar,
    removeCheckIcon,
    // I know, you might be asking me why I did it, but believe me, at least for now, that it was necessary...
    noTimer,
  } = props;

  const didMount = useRef<boolean>(false);
  const [currentFocus, setCurrentFocus] = useState(-1);
  const [currentSuggestions, setCurrentSuggestions] =
    useState<IStyledAutocompleteSelectItemProps[]>();
  const [offsetPopover, setOffsetPopover] = useState(0);
  const [openDropView, setOpenDropView] = useState<boolean>(false);
  const [openDropViewCheck, setOpenDropViewCheck] = useState<boolean>(false);

  const [isHoverOnInput, setIsHoverOnInput] = useState(false);

  /**
   * Tricky hack. I either use a local state, or, if it's passed from props,
   * I use the props state.
   *
   * This does not break compatibility and allows me to use the value in any checks
   * on the parent component
   *
   * - Palhari
   */
  const [_selectedValueINTERNAL, _setSelectedValueINTERNAL] = useState(
    selectedOption.name
  );
  let _selectedValue =
    selectedValue !== undefined ? selectedValue : _selectedValueINTERNAL;
  let _setSelectedValue =
    setSelectedValue !== undefined
      ? setSelectedValue
      : _setSelectedValueINTERNAL;

  /**
   * Refs to keep track
   */
  const containerRef = useClickOutside(() => setOpenDropView(false));
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const suggestionRefMap = useRef<{
    [suggestionValue: string]: HTMLDivElement | null;
  }>({});

  const [dropviewPosition, setDropViewPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });
  const [dropViewWidth, setDropViewWidth] = useState<number>(0);
  const dropViewRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Update DropView position to match current Input location on screen.
   *
   * This function moves the DropView below the Input position.
   */
  function updateDropViewPosition() {
    if (!containerRef.current || !wrapperRef.current) return;
    const elementBoundingRect = (
      containerRef.current as HTMLDivElement
    ).getBoundingClientRect();

    setDropViewPosition({
      top: elementBoundingRect.top + elementBoundingRect.height,
      left: elementBoundingRect.left,
    });

    setDropViewWidth(elementBoundingRect.width);
  }

  useEffect(() => {
    if (!openDropView) {
      setCurrentFocus(-1);
      return () => {};
    }

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
  }, [wrapperRef, openDropView]);

  useEffect(() => {
    (async () => {
      if (!openDropView) setOffsetPopover(0);
      if (!dropViewRef.current || !wrapperRef.current) return;

      //wait to open the dropdown before calculate
      await new Promise((resolve) => setTimeout(resolve, 50));

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
    })();
  }, [dropViewRef, openDropView, _selectedValue]);

  //Create other state to show dropdown, because hide the flick when the dropdown rend below and need to be above
  useEffect(() => {
    if (openDropView)
      setTimeout(() => {
        setOpenDropViewCheck(true);
      }, 200);
    else {
      setOpenDropViewCheck(false);
    }
  }, [openDropView]);

  useEffect(() => {
    if (options) {
      setCurrentSuggestions(options);
    }
  }, [options]);

  /**
   * On window resize, calculate position
   */
  useEffect(() => {
    function closeDropView() {
      setOpenDropView(false);
    }

    window.addEventListener("resize", closeDropView);
    return () => window.removeEventListener("resize", closeDropView);
  }, []);

  useEffect(() => {
    if (!currentSuggestions?.length) return;
    if (currentFocus === -1) return;
    if (!suggestionRefMap.current) return;

    suggestionRefMap.current[
      currentSuggestions[currentFocus].name
    ]?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "start",
    });
  }, [currentFocus, suggestionRefMap, currentSuggestions]);

  function handleItemClick(option: IOption) {
    onOptionSelect({ name: option.name, value: option.value });
    _setSelectedValue(option.name);
    setOpenDropView(false);
    setIsHoverOnInput(false);
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (!currentSuggestions) return;
    const lastItem = currentSuggestions.length - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();

      if (currentFocus === lastItem) {
        setCurrentFocus(0);
      } else {
        setCurrentFocus(currentFocus + 1);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      if (currentFocus === 0 || currentFocus === -1) {
        setCurrentFocus(lastItem);
      } else {
        setCurrentFocus(currentFocus - 1);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentFocus > -1) {
        const opt = currentSuggestions[currentFocus] as IOption;
        handleItemClick(opt);
      } else {
        handleItemClick({ name: "", value: "" });
      }
    }
  }

  useEffect(() => {
    _setSelectedValue(selectedOption.name);
  }, [selectedOption.name]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setCurrentFocus(-1);
    setOpenDropView(true);
    _setSelectedValue(value);

    // If there's a callback, propagate to the parent
    // if (onInputChange) onInputChange(value);

    const suggestionsArray = options
      .map((suggestion, index) => ({
        ...suggestion,
        index,
        isActive: false,
      }))
      .filter((suggestion) => {
        return suggestion.name
          .toLocaleLowerCase()
          .includes(value.toLocaleLowerCase().trim());
      });

    updateDropViewPosition();
    setCurrentSuggestions(suggestionsArray);

    if (value === "") {
      onOptionSelect({
        value: "",
        name: "",
      });
    }
  }

  function onFocus() {
    const suggestionsArray = options.map((suggestion, index) => ({
      ...suggestion,
      index,
      isActive: false,
    }));

    updateDropViewPosition();
    setCurrentSuggestions(suggestionsArray);
    setOpenDropView(true);
  }

  useEffect(() => {
    if (!openDropView && didMount.current && !noTimer) {
      setTimeout(() => {
        if (!resetOnClosedDropview) return;

        if (_selectedValue !== "" && selectedOption.name === "") {
          _setSelectedValue("");
        } else if (_selectedValue !== "" && selectedOption.name !== "") {
          _setSelectedValue(selectedOption.name);
        }
      }, 100);
    }
    didMount.current = true;
  }, [openDropView]);

  return (
    <AutoCompleteDiv
      ref={containerRef}
      onMouseEnter={() => {
        setIsHoverOnInput(true);
      }}
      onMouseLeave={() => {
        setIsHoverOnInput(false);
      }}
    >
      <InputContainer ref={wrapperRef}>
        <Input
          ref={inputRef}
          active={openDropView}
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={onFocus}
          value={_selectedValue}
          type="text"
          placeholder={placeholder}
          autoComplete="off"
        />
        {openDropView && (
          <StyledAutocompleteList
            style={{
              display:
                hideNoOption && currentSuggestions!.length === 0
                  ? "none"
                  : "initial",

              visibility: openDropViewCheck ? "visible" : "hidden",
            }}
            offset={offsetPopover}
            ref={dropViewRef}
            position={dropviewPosition}
            width={dropViewWidth}
            key={currentSuggestions!.length}
          >
            {currentSuggestions && currentSuggestions.length > 0 ? (
              currentSuggestions.map((suggestionItem, index) => {
                return (
                  <div
                    key={suggestionItem.name}
                    ref={(r) =>
                      (suggestionRefMap.current[suggestionItem.name] = r)
                    }
                  >
                    <AutoCompleteSelectItem
                      onClick={() => handleItemClick(suggestionItem)}
                      name={suggestionItem.name}
                      isHover={currentFocus === index}
                      isSelected={selectedOption.value === suggestionItem.value}
                      alreadyWrittenText={_selectedValue}
                      startIcon={startIcon}
                      font={suggestionItem.font}
                      customItemToolbar={
                        renderCustomItemToolbar
                          ? renderCustomItemToolbar(suggestionItem)
                          : undefined
                      }
                      removeCheckIcon={removeCheckIcon}
                    />
                  </div>
                );
              })
            ) : (
              <AutoCompleteSelectItem
                customStyle={{
                  display: hideNoOption ? "none" : "initial",
                }}
                noOption
                onClick={() => null}
                name={"No options"}
                isHover={false}
                isSelected={false}
                alreadyWrittenText={"No options"}
              />
            )}
          </StyledAutocompleteList>
        )}
      </InputContainer>

      {!disabled && (
        <>
          {(isHoverOnInput || openDropView) && _selectedValue !== "" && (
            <Select
              css={css`
                right: 35px;
                top: 10px;

                ${hideNoOption && currentSuggestions?.length === 0
                  ? css`
                      right: 10px;
                    `
                  : ""}
              `}
              onClick={(e) => {
                handleItemClick({ name: "", value: "" });
                e.stopPropagation();
              }}
            >
              <IoMdClose color="#777777" size={16} />
            </Select>
          )}
          <Select
            css={css`
              right: 10px;
              top: 10px;

              ${hideNoOption &&
              currentSuggestions?.length === 0 &&
              css`
                display: none;
              `}
            `}
            onClick={(e) => {
              if (inputRef.current && !openDropView) inputRef.current.focus();
              else setOpenDropView(false);
              e.stopPropagation();
            }}
          >
            {openDropView ? (
              <div
                css={css`
                  margin-top: 8px;
                `}
              >
                <FaSortUp color="#777777" size={14} />
              </div>
            ) : (
              <div
                css={css`
                  margin-bottom: 4px;
                `}
              >
                <FaSortDown color="#777777" size={14} />
              </div>
            )}
          </Select>
        </>
      )}
    </AutoCompleteDiv>
  );
}
