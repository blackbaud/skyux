import {
  SkyAffixOffset
} from './affix-offset';

/**
 * Returns the offset values of a given element.
 * @param element The HTML element.
 * @param bufferOffset An optional offset to add/subtract to the element's actual offset.
 */
export function getElementOffset(
  element: HTMLElement,
  bufferOffset: SkyAffixOffset = {}
): SkyAffixOffset {

  const bufferOffsetBottom = bufferOffset.bottom || 0;
  const bufferOffsetLeft = bufferOffset.left || 0;
  const bufferOffsetRight = bufferOffset.right || 0;
  const bufferOffsetTop = bufferOffset.top || 0;

  let top: number;
  let left: number;
  let right: number;
  let bottom: number;

  if (element === document.body) {
    left = 0;
    top = 0;
    right = document.documentElement.clientWidth;
    bottom = document.documentElement.clientHeight;
  } else {
    const clientRect = element.getBoundingClientRect();
    left = clientRect.left;
    top = clientRect.top;
    right = clientRect.right;
    bottom = clientRect.bottom;
  }

  bottom -= bufferOffsetBottom;
  left += bufferOffsetLeft;
  right -= bufferOffsetRight;
  top += bufferOffsetTop;

  return {
    bottom,
    left,
    right,
    top
  };
}

export function getOverflowParents(child: HTMLElement): HTMLElement[] {
  const bodyElement = window.document.body;
  const results = [bodyElement];

  let parentElement = child.parentNode;

  while (
    parentElement !== undefined &&
    parentElement !== bodyElement &&
    parentElement instanceof HTMLElement
  ) {
    const overflowY = window
      .getComputedStyle(parentElement, undefined)
      .overflowY
      .toLowerCase();

    if (
      overflowY === 'auto' ||
      overflowY === 'hidden' ||
      overflowY === 'scroll'
    ) {
      results.push(parentElement);
    }

    parentElement = parentElement.parentNode;
  }

  return results;
}

/**
 * Confirms offset is fully visible within a parent element.
 * @param parent
 * @param offset
 */
export function isOffsetFullyVisibleWithinParent(
  parent: HTMLElement,
  offset: SkyAffixOffset,
  bufferOffset?: SkyAffixOffset
): boolean {
  const parentOffset = getElementOffset(parent, bufferOffset);

  return !(
    parentOffset.top > offset.top ||
    parentOffset.right < offset.right ||
    parentOffset.bottom < offset.bottom ||
    parentOffset.left > offset.left
  );
}

export function isOffsetPartiallyVisibleWithinParent(
  parent: HTMLElement,
  offset: SkyAffixOffset,
  bufferOffset?: SkyAffixOffset
): boolean {
  const parentOffset = getElementOffset(parent, bufferOffset);

  return !(
    parentOffset.top >= offset.bottom ||
    parentOffset.right <= offset.left ||
    parentOffset.bottom <= offset.top ||
    parentOffset.left >= offset.right
  );
}
