/** @jsxImportSource @emotion/react */
import { useNode, useEditor } from "@craftjs/core";
import styled from "@emotion/styled";
import cx from "classnames";
import { debounce } from "debounce";
import { Resizable } from "re-resizable";
import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  isPercentage,
  pxToPercent,
  percentToPx,
  getElementDimensions,
} from "../utils/numToMeasurement";

const Indicators = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  span {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 100%;
    display: block;
    box-shadow: 0px 0px 12px -1px rgba(0, 0, 0, 0.25);
    z-index: 99999;
    pointer-events: none;
    border: 2px solid #36a9e0;
    &:nth-child(1) {
      left: -5px;
      top: -5px;
    }
    &:nth-child(2) {
      right: -5px;
      top: -5px;
      display: block;
    }
    &:nth-child(3) {
      left: -5px;
      bottom: -5px;
    }
    &:nth-child(4) {
      bottom: -5px;
      right: -5px;
      display: block;
    }
  }
`;

export const Resizer = ({ propKey, children, ...props }: any) => {
  const {
    id,
    actions: { setProp },
    connectors: { connect },
    nodeWidth,
    nodeHeight,
    parent,
    active,
    inNodeContext,
  } = useNode((node) => ({
    parent: node.data.parent,
    active: node.events.selected,
    nodeWidth: node.data.props[propKey.width],
    nodeHeight: node.data.props[propKey.height],
    fillSpace: node.data.props.fillSpace,
  }));

  const { isRootNode, parentDirection } = useEditor((state, query) => {
    return {
      parentDirection:
        parent &&
        state.nodes[parent] &&
        state.nodes[parent].data.props.flexDirection,
      isRootNode: query.node(id).isRoot(),
    };
  });

  const resizable = useRef<Resizable>(null);
  const isResizing = useRef<Boolean>(false);
  const editingDimensions = useRef<null | { width: number; height: number }>(
    null
  );
  const nodeDimensions = useRef<null | { width: number; height: number }>(null);
  nodeDimensions.current = { width: nodeWidth, height: nodeHeight };

  /**
   * Using an internal value to ensure the width/height set in the node is converted to px
   * because for some reason the <re-resizable /> library does not work well with percentages.
   */
  const [internalDimensions, setInternalDimensions] = useState({
    width: nodeWidth,
    height: nodeHeight,
  });

  const updateInternalDimensionsInPx = useCallback(() => {
    if (!nodeDimensions.current) return;

    if (!resizable.current?.resizable?.parentElement) return;

    const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;

    const width = percentToPx(
      nodeWidth,
      resizable.current?.resizable?.parentElement &&
        getElementDimensions(resizable.current?.resizable?.parentElement).width
    );
    const height = percentToPx(
      nodeHeight,
      resizable.current?.resizable?.parentElement &&
        getElementDimensions(resizable.current.resizable.parentElement).height
    );

    setInternalDimensions({
      width,
      height,
    });
  }, []);

  const updateInternalDimensionsWithOriginal = useCallback(() => {
    if (!nodeDimensions.current) return;
    const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;
    setInternalDimensions({
      width: nodeWidth,
      height: nodeHeight,
    });
  }, []);

  const getUpdatedDimensions = (width: number, height: number) => {
    const dom = resizable.current?.resizable;
    if (!dom) return;
    if (!editingDimensions.current) return;

    const currentWidth = parseInt(editingDimensions.current?.width.toString()),
      currentHeight = parseInt(editingDimensions.current?.height.toString());

    return {
      width: currentWidth + parseInt(width.toString()),
      height: currentHeight + parseInt(height.toString()),
    };
  };

  useEffect(() => {
    if (!isResizing.current) updateInternalDimensionsWithOriginal();
  }, [nodeWidth, nodeHeight, updateInternalDimensionsWithOriginal]);

  useEffect(() => {
    const listener = debounce(updateInternalDimensionsWithOriginal, 1);
    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [updateInternalDimensionsWithOriginal]);

  return (
    <Resizable
      enable={[
        "top",
        "left",
        "bottom",
        "right",
        "topLeft",
        "topRight",
        "bottomLeft",
        "bottomRight",
      ].reduce((acc: any, key) => {
        acc[key] = active && inNodeContext;
        return acc;
      }, {})}
      className={cx([
        {
          "m-auto": isRootNode,
          flex: true,
        },
      ])}
      ref={(ref) => {
        if (ref) {
          (resizable as any).current = ref;
          connect(resizable.current?.resizable as any);
        }
      }}
      size={internalDimensions}
      onResizeStart={(e) => {
        updateInternalDimensionsInPx();
        e.preventDefault();
        e.stopPropagation();
        const dom = resizable.current?.resizable;
        if (!dom) return;
        editingDimensions.current = {
          width: dom.getBoundingClientRect().width,
          height: dom.getBoundingClientRect().height,
        };
        isResizing.current = true;
      }}
      onResize={(_, __, ___, d) => {
        const dom = resizable.current?.resizable;

        if (!dom?.parentElement) return;

        const dimensions = getUpdatedDimensions(d.width, d.height);
        if (!dimensions) return;

        let {
          width,
          height,
        }: { width: number | string; height: number | string } = dimensions;

        if (isPercentage(nodeWidth))
          width =
            pxToPercent(width, getElementDimensions(dom?.parentElement).width) +
            "%";
        else width = `${width}px`;

        if (isPercentage(nodeHeight))
          height =
            pxToPercent(
              height,
              getElementDimensions(dom?.parentElement).height
            ) + "%";
        else height = `${height}px`;

        if (
          isPercentage(width) &&
          dom?.parentElement?.style.width === "auto" &&
          editingDimensions.current?.width
        ) {
          width = editingDimensions.current?.width + d.width + "px";
        }

        if (
          isPercentage(height) &&
          dom?.parentElement?.style.height === "auto" &&
          editingDimensions.current?.height
        ) {
          height = editingDimensions.current?.height + d.height + "px";
        }

        setProp((prop: Record<string, any>) => {
          prop[propKey.width] = width;
          prop[propKey.height] = height;
        }, 500);
      }}
      onResizeStop={() => {
        isResizing.current = false;
        updateInternalDimensionsWithOriginal();
      }}
      {...props}
    >
      {children}
      {active && (
        <Indicators>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </Indicators>
      )}
    </Resizable>
  );
};
