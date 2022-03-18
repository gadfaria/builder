/**
 * Recursively walks the DOM up looking for a Node that has a scroll,
 * from an initial Node.
 * @param currentNode
 * @param initialNode
 */
export function getScrollParent(
  currentNode: HTMLDivElement | null,
  initialNode: HTMLDivElement | null
): HTMLDivElement | null {
  if (currentNode == null) {
    return null;
  }

  if (
    currentNode.scrollHeight > currentNode.clientHeight &&
    currentNode !== initialNode
  ) {
    return currentNode;
  }

  return getScrollParent(currentNode.parentNode as HTMLDivElement, initialNode);
}
