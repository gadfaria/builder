/** @jsxImportSource @emotion/react */
import { arrayMove, useSortable } from "@dnd-kit/sortable";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { PrimitiveAtom, useAtom } from "jotai";
import { nanoid } from "nanoid";
import React, { MouseEventHandler, PropsWithChildren } from "react";
import {
  FaArrowDown,
  FaArrowsAlt,
  FaArrowUp,
  FaRegCopy,
  FaRegTrashAlt,
} from "react-icons/fa";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { indexesAtom, itemsAtom, ItemType, selectedItemAtom } from "./Builder";
import {
  DEFAULT_COLOR,
  DEFAULT_COLOR_LINK,
  DEFAULT_VISITED_COLOR_LINK,
} from "./BuilderConsts";

type ItemContainerProps = {
  isPreview: boolean;
};

const ItemContainer = styled(motion.div)<ItemContainerProps>`
  /* width: 60vw; */
  width: 1152px;
  border-top: solid 2px transparent;
  border-bottom: solid 2px transparent;
`;

export const ItemRelative = styled(motion.div)`
  height: 100%;
  position: relative;
`;

export const ItemAction = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${DEFAULT_COLOR};
  border: 2px solid ${DEFAULT_COLOR};
  border-radius: 4px;
  margin-bottom: 10px;
  transition: opacity 0.3s;

  :hover {
    opacity: 0.7;
  }
  svg {
    color: white;
  }
`;

export const Item = styled.div<{ linkStyle: any }>`
  a {
    color: ${(props) => props.linkStyle.color || DEFAULT_COLOR_LINK} !important;

    :visited {
      color: ${(props) =>
        props.linkStyle.visitedColor || DEFAULT_VISITED_COLOR_LINK} !important;
    }
  }
`;

export const ItemActionContainer = styled(motion.div)`
  position: absolute;
  display: flex;
  align-items: center;
  top: -41px;
  z-index: 1;
`;

type ItemChildrenContainerProps = {
  isSelected: boolean;
  isPreview: boolean;
  isText: boolean;
};

export const ItemChildrenContainer = styled(
  motion.div
)<ItemChildrenContainerProps>`
  height: 100%;
  background-color: transparent;
  border-radius: 10px;
  border: 2px solid ${DEFAULT_COLOR};
  border-color: ${(props) => (props.isSelected ? DEFAULT_COLOR : "transparent")};
  min-height: ${(props) =>
    props.isSelected ? (props.isText ? "135px" : "70px") : "auto"};
`;

const CAN_DUPLICATE = ["TEXT", "IMAGE"];

interface Props {
  index: number;
  over: "TOP" | "BOTTOM" | null;
  itemAtom: PrimitiveAtom<ItemType>;
  isPreview: boolean;
  isSelected: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function BuilderItem(props: PropsWithChildren<Props>) {
  const { isSelected, onClick, itemAtom, index, isPreview, over } = props;

  const [item, setItem] = useAtom(itemAtom);
  const [items, setItems] = useAtom(itemsAtom);
  const [indexes, setIndexes] = useAtom(indexesAtom);
  const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom);
  const itemStyle = { ...item.style };
  const currentIndex = indexes.findIndex((i) => i === index);

  let { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: index + "", disabled: isPreview });

  // Hack to reduce warping
  if (transform) transform.scaleY = 1;

  function handleDeleteClick() {
    const newItem = { ...item, deleted: true };
    setItem(newItem);
    setIndexes((indexes) => indexes.filter((i) => i !== index));
    setSelectedItem(0);
  }

  function handleDuplicateClick() {
    setItems((items) => [...items, { ...item, id: nanoid() }]);
    setIndexes((indexes) => {
      const newIndexes = [...indexes];
      newIndexes.splice(
        indexes.findIndex((i) => i === index),
        0,
        items.length
      );
      return newIndexes;
    });
  }

  function handleUpAndDownNode(up?: boolean) {
    if (up) {
      setIndexes((indexes) =>
        arrayMove(indexes, currentIndex, currentIndex - 1)
      );
    } else {
      setIndexes((indexes) =>
        arrayMove(indexes, currentIndex, currentIndex + 1)
      );
    }
  }

  const { content: Component } = item;

  if (!Component) return null;

  const initialStyles = {
    x: 0,
    y: 0,
    scale: 1,
  };

  const widthStyle = itemStyle.width;
  delete itemStyle.width;

  function Line({ layoutId }: any) {
    return (
      <motion.div
        css={css`
          display: flex;
          align-items: center;
          margin: -3px -11px 0px;
          svg {
            width: 2.5em;
            height: 2.5em;
            color: ${DEFAULT_COLOR};
          }
        `}
        layoutId={layoutId}
      >
        <IoMdArrowDropright />
        <div
          css={css`
            width: 100%;
            height: 4px;
            margin: 10px -16px 10px;
            background: ${DEFAULT_COLOR} 0% 0% no-repeat padding-box;
          `}
        />
        <IoMdArrowDropleft />
      </motion.div>
    );
  }

  return (
    <ItemContainer
      className="form-builder-item-container"
      ref={setNodeRef}
      isPreview={isPreview}
      css={
        widthStyle &&
        css`
          width: ${widthStyle} !important;
        `
      }
      animate={
        transform
          ? {
              y: transform.y,
              zIndex: isDragging ? 1 : 0,
            }
          : initialStyles
      }
      transition={{
        duration: !isDragging ? 0.25 : 0,
        easings: {
          type: "spring",
        },
        scale: {
          duration: 0.25,
        },
        zIndex: {
          delay: isDragging ? 0 : 0.25,
        },
      }}
      {...attributes}
    >
      <ItemRelative>
        {over === "TOP" && <Line layoutId={`top-${index}`} />}
        <ItemChildrenContainer
          onClick={onClick}
          isText={item.type === "TEXT"}
          isSelected={isSelected && !isPreview}
          isPreview={isPreview}
          layoutId={isPreview ? undefined : `card-${index}`}
        >
          <Item
            linkStyle={{
              color: itemStyle?.linkColor || DEFAULT_COLOR_LINK,
              visitedColor:
                itemStyle?.visitedLinkColor || DEFAULT_VISITED_COLOR_LINK,
            }}
            style={{ ...itemStyle, height: "100%" }}
          >
            <Component
              item={item}
              setItem={setItem}
              isPreview={isPreview}
              isSelected={isSelected}
            />
          </Item>
        </ItemChildrenContainer>

        {isSelected && !isPreview && (
          <>
            <ItemActionContainer
              css={css`
                > div {
                  margin-right: 10px;
                }
              `}
              layoutId={`left-items-${index}`}
            >
              {CAN_DUPLICATE.includes(item.type) && (
                <ItemAction
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateClick();
                  }}
                  css={css`
                    cursor: pointer;
                  `}
                >
                  <FaRegCopy />
                </ItemAction>
              )}

              <ItemAction
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick();
                }}
                css={css`
                  cursor: pointer;
                `}
              >
                <FaRegTrashAlt />
              </ItemAction>
            </ItemActionContainer>

            <ItemActionContainer
              css={css`
                right: 0;

                > div {
                  margin-left: 10px;
                }
              `}
              layoutId={`right-items-${index}`}
            >
              {/* 0 always is the first element in the array. Then, if an 
                element have 0 as your left neighboor, it should not have
                an ArrowUp option.
            */}
              {indexes[indexes.indexOf(index) - 1] !== 0 && (
                <ItemAction
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpAndDownNode(true);
                  }}
                  css={css`
                    cursor: pointer;
                  `}
                >
                  <FaArrowUp />
                </ItemAction>
              )}

              {/* Items should have an ArrowDown option, besides the last. */}
              {indexes.indexOf(index) !== indexes.length - 1 && (
                <ItemAction
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpAndDownNode();
                  }}
                  css={css`
                    cursor: pointer;
                  `}
                >
                  <FaArrowDown />
                </ItemAction>
              )}

              <ItemAction
                {...listeners}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                css={css`
                  cursor: grabbing;
                `}
              >
                <FaArrowsAlt />
              </ItemAction>
            </ItemActionContainer>
          </>
        )}
        {over === "BOTTOM" && <Line layoutId={`bottom-${index}`} />}
      </ItemRelative>
    </ItemContainer>
  );
}
