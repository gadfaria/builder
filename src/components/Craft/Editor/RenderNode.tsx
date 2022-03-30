/** @jsxImportSource @emotion/react */
import { useEditor, useNode } from "@craftjs/core";
import { ROOT_NODE } from "@craftjs/utils";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useCallback, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { FaArrowsAlt, FaArrowUp, FaRegTrashAlt } from "react-icons/fa";
import { DEFAULT_COLOR } from "../utils/consts";

const IndicatorDiv = styled.div`
  height: 30px;
  margin-top: -29px;
  font-size: 12px;
  line-height: 12px;

  position: fixed;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  background-color: ${DEFAULT_COLOR};
  border-radius: 5px 5px 0px 0px;

  svg {
    fill: #fff;
    width: 15px;
    height: 15px;
  }
`;

const IconButton = styled.a`
  padding: 0 0px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  > div {
    position: relative;
    top: -50%;
    left: -50%;
  }
`;

const Name = styled.h2`
  margin-right: 1rem;
  flex: 1 1 0%;
`;

interface Props {
  render: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export const RenderNode = ({ render }: Props) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }));

  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dom) {
      if (isActive || isHover) dom.classList.add("component-selected");
      else dom.classList.remove("component-selected");
    }
  }, [dom, isActive, isHover]);

  const getPos = useCallback((dom: HTMLElement) => {
    const { top, left, bottom } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  const scroll = useCallback(() => {
    if (!dom) return;
    const { current: currentDOM } = currentRef;

    if (!currentDOM) return;
    const { top, left } = getPos(dom);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom, getPos]);

  useEffect(() => {
    document
      .querySelector(".main-container")
      ?.addEventListener("scroll", scroll);

    return () => {
      document
        .querySelector(".main-container")
        ?.removeEventListener("scroll", scroll);
    };
  }, [scroll]);

  // if (!dom) return <></>;

  return (
    <>
      {isHover || isActive
        ? ReactDOM.createPortal(
            name !== "Main" && (
              <>
                <IndicatorDiv
                  ref={currentRef}
                  style={{
                    left: getPos(dom as HTMLElement).left,
                    top: getPos(dom as HTMLElement).top,
                    zIndex: 9999,
                  }}
                >
                  <Name>{name}</Name>
                  {moveable && (
                    <IconButton
                      css={css`
                        margin-right: 0.5rem;
                        cursor: move;
                      `}
                      ref={drag as any}
                    >
                      <FaArrowsAlt />
                    </IconButton>
                  )}

                  {id !== ROOT_NODE && (
                    <IconButton
                      css={css`
                        margin-right: 0.5rem;
                        cursor: move;
                      `}
                      onClick={() => {
                        actions.selectNode(parent);
                      }}
                    >
                      <FaArrowUp />
                    </IconButton>
                  )}
                  {deletable && (
                    <IconButton
                      css={css`
                        cursor: pointer;
                      `}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        actions.delete(id);
                      }}
                    >
                      <FaRegTrashAlt />
                    </IconButton>
                  )}
                </IndicatorDiv>
              </>
            ),
            document.querySelector(".craft-container") as HTMLElement
          )
        : null}
      {render}
    </>
  );
};
