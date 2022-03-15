/** @jsxImportSource @emotion/react */
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimateSharedLayout, motion } from "framer-motion";
import { atom, useAtom } from "jotai";
import localforage from "localforage";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { isMobileSafari, isSafari } from "react-device-detect";
import {
  BsLayoutTextSidebar,
  BsLayoutTextSidebarReverse,
} from "react-icons/bs";
import ReactTooltip from "react-tooltip";
import useMediaQuery from "../../hooks/useMediaQuery";
import { customTooltip } from "../../utils/style";
import BuilderCheckbox from "./BuilderCheckbox";
import BuilderEditor from "./BuilderEditor";
import BuilderFooter from "./BuilderFooter";
import BuilderImage from "./BuilderImage";
import BuilderInputs from "./BuilderInputs";
import BuilderItem from "./BuilderItem";
import BuilderMain from "./BuilderMain";
import BuilderSidebar from "./BuilderSidebar";
import BuilderSideBarCard from "./BuilderSideBarCard";
import BuilderTopBar from "./BuilderTopBar";
import { splitAtomWithFallback } from "./splitAtomWithFallback";

export const TooltipText = styled.span`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0px;
  color: #ffffff;
`;

export interface IForm {
  _id?: string;
  name: string;
  nameType: FormNameType;
  userUid: string;
  submitted: number;
  viewed: number;
  url: string;
  createdAt: Date;
  formTagId: string;
  isInternal?: boolean;
  externalUsers: string[];
  description?: string;
  builder?: any;
  hasBuilder?: boolean;
  thankYouBuilder?: any;
  hasThankYouBuilder?: boolean;
}

export enum FormNameType {
  FIRST_NAME = "FIRST_NAME",
  FULL_NAME = "FULL_NAME",
  NO_NAME = "NO_NAME",
}

const Container = styled.div<{ isPreview: boolean }>`
  display: grid;
  max-width: 100vw;
  width: 100%;
  grid-template-columns: 300px auto 300px;
  height: 100vh;
  min-height: 100%;
  overflow: hidden;
  padding-top: 81px;

  @media (max-width: 1680px) {
    display: flex;
  }

  ${(props) =>
    props.isPreview &&
    css`
      display: block;
      position: fixed;
      grid-template-columns: 1px auto 1px;
      padding-top: 0px;
    `}
`;

const Sidebar = styled(motion.div)<{ right?: boolean }>`
  width: 100%;
  max-width: 300px;
  height: calc(100vh - 81px);
  background-color: #fff;
  z-index: 2;

  @media (max-width: 1680px) {
    position: absolute;
    bottom: 0;

    ${(props) =>
      props.right &&
      css`
        right: 0;
      `}
  }
`;

const SideBarCards = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 115px);
  grid-gap: 20px;
  justify-content: center;
`;

export const SideBarText = styled.div`
  font-size: 14px;
  letter-spacing: 0.35px;
  color: #979797;
  font-weight: 600;
  margin: 25px 25px 18px;
`;

const SideBarButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  width: 30px;
  height: 30px;
  margin: 10px;
  z-index: 1;

  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 3px;

  cursor: pointer;

  transition: border-color 0.3s;

  svg {
    color: rgba(0, 0, 0, 0.16);

    transition: color 0.3s;
  }

  :hover {
    border-color: #fb972e;

    svg {
      color: #fb972e;
    }
  }
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
`;

const Empty = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 100px;
    height: 139px;
  }
`;

const EmptyText = styled.div`
  text-align: center;
  letter-spacing: 0px;
  color: #222222;
  font-size: 24px;
  font-weight: 600;
  margin-top: 20px;
`;

const EmptyDescription = styled.div`
  text-align: center;
  letter-spacing: 0px;
  color: #707070;
  font-size: 18px;
  margin-top: 7px;
`;

export type Types = "TEXT" | "IMAGE" | "FORM" | "MAIN" | "CHECKBOX" | "FOOTER";

const TYPES: { label: string; type: Types; icon: string }[] = [
  {
    label: "Text",
    type: "TEXT",
    icon: "../icons/builder/text.svg",
  },
  {
    label: "Image",
    type: "IMAGE",
    icon: "../icons/builder/image.svg",
  },
  {
    label: "Checkbox",
    type: "CHECKBOX",
    icon: "../icons/builder/checkbox.svg",
  },
  {
    label: "Form",
    type: "FORM",
    icon: "../icons/builder/form.svg",
  },
  {
    label: "Footer",
    type: "FOOTER",
    icon: "../icons/builder/footer.svg",
  },
];

const THANK_YOU_TYPES = ["TEXT", "IMAGE", "FOOTER"];
export interface ItemType {
  id: string;
  type: Types;
  content?: typeof BuilderInputs | typeof BuilderEditor;
  style?: {
    fontFamily?: string;
    color?: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    checkbox?: boolean;
    fontSize?: string;
    width?: string;
    opacity?: string;
    borderRadius?: string;
    lineHeight?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    paddingBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    marginBottom?: string;
    linkColor?: string;
    visitedLinkColor?: string;
    checkboxColor?: string;
  };
  state?: any;
  deleted?: boolean;
}

type Unsubscribe = () => void;

type Storage<Value> = {
  getItem: (key: string) => Value | Promise<Value>;
  setItem: (key: string, newValue: Value) => void | Promise<void>;
  delayInit?: boolean;
  subscribe?: (key: string, callback: (value: Value) => void) => Unsubscribe;
};

export const indexesAtom = atom<number[]>([]);
export const itemsAtom = atom<ItemType[]>([]);

export const itemListAtom = splitAtomWithFallback(itemsAtom);
export const formAtom = atom<IForm | null>(null);
export const selectedItemAtom = atom<number | null>(0);
export const formBuilderCheckboxAtom = atom<boolean | null>(null);
export const isThankYouAtom = atom<boolean>(false);

function cleanUpStorage() {
  localforage.clear();
}

const MAIN_ITEM: ItemType = {
  id: "main",
  type: "MAIN",
  style: {},
};

const variantsRight = {
  open: {
    // opacity: 1,
    display: "block",
  },
  closed: {
    // opacity: 0,
    x: 300,
    transitionEnd: {
      display: "none",
    },
  },
};

const variantsLeft = {
  open: {
    // opacity: 1,
    display: "block",
  },
  closed: {
    // opacity: 0,
    x: -300,
    transitionEnd: {
      display: "none",
    },
  },
};

interface Props {
  builder: any;
  isPreview: boolean;
  isThankYou: boolean;
}

export default function Builder(props: Props) {
  const router = useRouter();
  const [itemList, setItemsList] = useAtom(itemListAtom);
  const [indexes, setIndexes] = useAtom(indexesAtom);
  const [items, setItems] = useAtom(itemsAtom);
  const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom);
  const [, setCheckbox] = useAtom(formBuilderCheckboxAtom);
  const [form, setForm] = useAtom(formAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [overPosition, setOverPosition] = useState<{
    id: string;
    over: "TOP" | "BOTTOM";
  } | null>(null);
  const isLargerThan1680 = useMediaQuery("(min-width: 1680px)");
  const [showLeftSideBar, setShowLeftSideBar] = useState(false);
  const [showRightSideBar, setShowRightSideBar] = useState(false);
  const [isThankYou, setIsThankYou] = useAtom(isThankYouAtom);
  const [isChanging, setIsChanging] = useState(false);
  const alreadyLoadedItems = useRef(false);
  const alreadyLoadedIndexes = useRef(false);
  const alreadyLoaded = useRef(false);

  useEffect(() => {
    setIsThankYou(props.isThankYou);
  }, [props.isThankYou]);

  useEffect(() => {
    return () => {
      if (!props.isPreview) {
        cleanUpStorage();
        setItems([]);
        setIndexes([]);
        setIsThankYou(false);
        //@ts-ignore
        setForm(null);
      }
    };
  }, []);

  useEffect(() => {
    setForm(props.builder);
  }, [props.builder]);

  useEffect(() => {
    if (!alreadyLoaded.current) return;
    (async () => {
      setIsChanging(true);

      let loadedItems = JSON.parse(
        (await localforage.getItem(
          isThankYou ? "thank-you-items" : "items"
        )) as string
      );

      let loadedIndexes = JSON.parse(
        (await localforage.getItem(
          isThankYou ? "thank-you-indexes" : "indexes"
        )) as string
      );

      if (!loadedItems) {
        loadedItems = isThankYou
          ? props.builder.thankYouBuilder?.items
          : props.builder.builder?.items;

        loadedIndexes = isThankYou
          ? props.builder.thankYouBuilder?.indexes
          : props.builder.builder?.indexes;
      }

      if (loadedItems && loadedIndexes) {
        const newItems = loadedItems.map((parsedItem: any) => {
          const { content } = checkType(parsedItem.type);

          return {
            ...parsedItem,
            content,
          };
        });

        setItems(newItems);
        // @ts-ignore
        setCheckbox(
          newItems.findIndex(
            (i: any) => i.type === "CHECKBOX" && !i.deleted
          ) === -1
        );
        setIndexes(loadedIndexes);
      } else {
        const initialArray = [];
        initialArray[0] = MAIN_ITEM;

        setItems(initialArray);
        setIndexes([0]);
        cleanUpStorage();
      }

      setIsChanging(false);
    })();
  }, [isThankYou]);

  useEffect(() => {
    // if (!alreadyLoaded.current) return;

    if (!alreadyLoadedItems.current) {
      alreadyLoadedItems.current = true;
      return;
    }

    localforage.setItem(
      isThankYou ? "thank-you-items" : "items",
      JSON.stringify(items)
    );
  }, [items]);

  useEffect(() => {
    // if (!alreadyLoaded.current) return;

    if (!alreadyLoadedIndexes.current) {
      alreadyLoadedIndexes.current = true;
      return;
    }

    localforage.setItem(
      isThankYou ? "thank-you-indexes" : "indexes",
      JSON.stringify(indexes)
    );
  }, [indexes]);

  useEffect(() => {
    if (!form) return;

    if (props.isPreview) {
      (async () => {
        const localItems = (await localforage.getItem(
          props.isThankYou ? "thank-you-items" : "items"
        )) as string;
        const localIndexes = (await localforage.getItem(
          props.isThankYou ? "thank-you-indexes" : "indexes"
        )) as string;

        if (localItems && localIndexes) {
          let parsedLocalItems: ItemType[] = JSON.parse(localItems);
          let parsedLocalIndexes: number[] = JSON.parse(localIndexes);

          const newItems = parsedLocalItems.map((parsedItem) => {
            const { content } = checkType(parsedItem.type);

            return {
              ...parsedItem,
              content,
            };
          });

          setItems(newItems);
          // @ts-ignore
          setCheckbox(
            newItems.findIndex((i) => i.type === "CHECKBOX" && !i.deleted) ===
              -1
          );
          setIndexes(parsedLocalIndexes);
        } else {
          cleanUpStorage();
        }

        setIsLoading(false);
      })();
    } else {
      const loadedItems = props.isThankYou
        ? form.thankYouBuilder?.items
        : form.builder?.items;

      const loadedIndexes = props.isThankYou
        ? form.thankYouBuilder?.indexes
        : form.builder?.indexes;

      if (loadedItems && loadedIndexes) {
        const newItems = loadedItems.map((parsedItem: any) => {
          const { content } = checkType(parsedItem.type);

          return {
            ...parsedItem,
            content,
          };
        });

        setItems(newItems);
        // @ts-ignore
        setCheckbox(
          newItems.findIndex(
            (i: any) => i.type === "CHECKBOX" && !i.deleted
          ) === -1
        );
        setIndexes(loadedIndexes);
      } else {
        const initialArray = [];
        initialArray[0] = MAIN_ITEM;

        setItems(initialArray);
        setIndexes([0]);
        cleanUpStorage();
      }

      setTimeout(() => (alreadyLoaded.current = true), 200);

      setIsLoading(false);
    }
  }, [form]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function hideSideBars() {
    setShowLeftSideBar(false);
    setShowRightSideBar(false);
  }

  function checkType(type: string): {
    type: Types;
    content: ItemType["content"];
  } {
    switch (type) {
      case "FORM":
        return { type: "FORM", content: BuilderInputs };
      case "IMAGE":
        return { type: "IMAGE", content: BuilderImage };
      case "CHECKBOX":
        return { type: "CHECKBOX", content: BuilderCheckbox };
      default:
        return { type: "TEXT", content: BuilderEditor };
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Remove the over indication
    setOverPosition(null);

    const id = nanoid();

    if (active.id === "FOOTER") {
      setItems([
        ...items,
        {
          id,
          type: "FOOTER",
        },
      ]);
      return;
    }

    if (indexes.length === 1) {
      const { content, type } = checkType(active.id);

      setItems([
        ...items,
        {
          id,
          type,
          content,
        },
      ]);

      setIndexes([...indexes, items.length]);
      //@ts-ignore
      setSelectedItem(1);

      return;
    }

    function getNewItem() {
      const oldIndex = indexes.findIndex((i) => i === parseInt(active.id));
      const newIndex = indexes.findIndex((i) => i === parseInt(over!.id));

      // I'm dropping something that's not yet on the array. I'm ADDING it
      if (oldIndex === -1) {
        let indexToBeInserted = newIndex;
        if (overPosition?.over === "BOTTOM") {
          indexToBeInserted += 1;
        }

        const id = nanoid();

        const { content, type } = checkType(active.id);

        // At the top of the list
        if (indexToBeInserted === 0) {
          return {
            newIndexes: [items.length, ...indexes],
            newItems: [
              ...items,
              {
                id,
                content,
                type,
              },
            ],
          };
        }

        // At the bottom of the list
        if (indexToBeInserted === items.length) {
          return {
            newIndexes: [...indexes, items.length],
            newItems: [
              ...items,
              {
                id,
                content,
                type,
              },
            ],
          };
        }

        const indexesCopy = [...indexes];

        indexesCopy.splice(indexToBeInserted, 0, items.length);
        return {
          newIndexes: indexesCopy,
          newItems: [
            ...items,
            {
              id,
              content,
              type,
            },
          ],
        };
      }

      return {
        newIndexes: arrayMove(indexes, oldIndex, newIndex),
        newItems: items,
      };
    }

    if (!over) return;

    // Find where to insert it
    if (active.id !== over.id) {
      const { newIndexes, newItems } = getNewItem();

      setItems(newItems);
      setIndexes(newIndexes);
    }
  }

  // Function to detect the item that I'm moving is relative to what
  // item already in the list, and if it should be added
  function itemMoveRelativePosition(event: DragMoveEvent) {
    const { active, over } = event;

    // If I'm moving an item on the list, ignore
    if (!TYPES.find((t) => t.type === active.id)) return;

    if (!over) return;

    let activeY = (active.rect.current.translated as any)?.offsetTop;
    let middleOfOver = (over.rect as any).offsetTop + over.rect.height / 2;

    if (!activeY) return;
    if (activeY > middleOfOver) {
      setOverPosition({
        id: over.id,
        over: "BOTTOM",
      });
    } else {
      setOverPosition({
        id: over.id,
        over: "TOP",
      });
    }
  }

  useEffect(() => {
    if (
      isLoading ||
      !form ||
      !props.isPreview ||
      (!isSafari && !isMobileSafari)
    )
      return;

    let node = document.querySelector("#__next");
    if (!node) return;
    document.body.removeChild(node);
    document.body.parentElement?.prepend(node);
  }, [isLoading, form]);

  if (isLoading || !form) return <></>;
  return (
    <>
      {!props.isPreview && <BuilderTopBar />}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragMove={itemMoveRelativePosition}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setOverPosition(null)}
        onDragStart={() => {
          setSelectedItem(null);
        }}
      >
        <Container isPreview={props.isPreview}>
          {!props.isPreview && (
            <SideBarButton
              css={css``}
              onClick={(e) => {
                setShowLeftSideBar(!showLeftSideBar);
                e.stopPropagation();
              }}
              data-tip
              data-for="left-side-bar-element"
            >
              <BsLayoutTextSidebarReverse />

              <ReactTooltip
                id="left-side-bar-element"
                place="right"
                effect="solid"
                backgroundColor="#333333"
                css={customTooltip}
              >
                <TooltipText>Element sidebar</TooltipText>
              </ReactTooltip>
            </SideBarButton>
          )}
          {!props.isPreview && (
            <Sidebar
              css={css`
                border-right: 1px solid rgba(0, 0, 0, 0.16);
                position: relative;
              `}
              animate={isLargerThan1680 || showLeftSideBar ? "open" : "closed"}
              variants={variantsLeft}
              transition={{
                bounce: false,
              }}
            >
              <SideBarText>FORM ELEMENTS</SideBarText>
              <SideBarCards>
                {TYPES.map((type) => {
                  if (isThankYou && !THANK_YOU_TYPES.includes(type.type))
                    return;

                  return (
                    <BuilderSideBarCard
                      key={type.type}
                      {...type}
                      alreadyExists={
                        items.findIndex(
                          (i) => i.type === type.type && !i.deleted
                        ) !== -1
                      }
                    />
                  );
                })}
              </SideBarCards>
            </Sidebar>
          )}

          {itemList[0] && (
            <BuilderMain
              onClick={(e) => {
                hideSideBars();
                e.stopPropagation();
                //@ts-ignore
                setSelectedItem(0);
              }}
              key={0}
              index={0}
              itemAtom={itemList[0]}
              isPreview={props.isPreview}
              isSelected={selectedItem === 0}
            >
              {!items.find((i) => i.type === "FOOTER" && !i.deleted) &&
              indexes.length === 1 ? (
                <Empty>
                  <img src="./images/empty-builder.svg" />
                  <EmptyText>Form Builder</EmptyText>
                  <EmptyDescription>
                    Select or drag and drop a form element here to get started.
                  </EmptyDescription>
                </Empty>
              ) : (
                <Wrapper>
                  <Content>
                    <SortableContext
                      items={indexes
                        .filter((index) => index > 0)
                        .map((item) => item + "")}
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimateSharedLayout>
                        {!isChanging &&
                          indexes.map((index) =>
                            index > 0 && items[index].type !== "FOOTER" ? (
                              <BuilderItem
                                over={
                                  overPosition?.id === index.toString()
                                    ? overPosition.over
                                    : null
                                }
                                key={index}
                                index={index}
                                itemAtom={itemList[index]}
                                isPreview={props.isPreview}
                                onClick={(e) => {
                                  hideSideBars();
                                  e.stopPropagation();
                                  !props.isPreview && setSelectedItem(index);
                                }}
                                isSelected={selectedItem === index}
                              />
                            ) : null
                          )}
                      </AnimateSharedLayout>
                    </SortableContext>
                  </Content>
                  {!isChanging &&
                    items.find((i) => i.type === "FOOTER" && !i.deleted) && (
                      <BuilderFooter
                        key="footer"
                        index={items.findIndex(
                          (i) => i.type === "FOOTER" && !i.deleted
                        )}
                        isSelected={
                          selectedItem ===
                          items.findIndex(
                            (i) => i.type === "FOOTER" && !i.deleted
                          )
                        }
                        isPreview={props.isPreview}
                        onClick={(e) => {
                          hideSideBars();
                          e.stopPropagation();
                          //@ts-ignore
                          setSelectedItem(
                            items.findIndex(
                              (i) => i.type === "FOOTER" && !i.deleted
                            )
                          );
                        }}
                      />
                    )}
                </Wrapper>
              )}
            </BuilderMain>
          )}

          {!props.isPreview && (
            <SideBarButton
              css={css`
                right: 0;
              `}
              onClick={(e) => {
                setShowRightSideBar(!showRightSideBar);
                e.stopPropagation();
              }}
              data-tip
              data-for="right-side-bar-style"
            >
              <BsLayoutTextSidebar />

              <ReactTooltip
                id="right-side-bar-style"
                place="right"
                effect="solid"
                backgroundColor="#333333"
                css={customTooltip}
              >
                <TooltipText>Style sidebar</TooltipText>
              </ReactTooltip>
            </SideBarButton>
          )}
          {!props.isPreview && (
            <Sidebar
              css={css`
                border-left: 1px solid rgba(0, 0, 0, 0.16);
                overflow-y: auto;
              `}
              right
              animate={isLargerThan1680 || showRightSideBar ? "open" : "closed"}
              variants={variantsRight}
              transition={{
                bounce: false,
              }}
            >
              {!props.isPreview && selectedItem && !!itemList[selectedItem] && (
                <BuilderSidebar itemAtom={itemList[selectedItem]} />
              )}
            </Sidebar>
          )}
        </Container>
      </DndContext>
    </>
  );
}
