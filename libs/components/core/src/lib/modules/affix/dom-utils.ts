import { SkyAffixOffset } from './affix-offset';

/**
 * Returns the offset values of a given element.
 * @param element The HTML element.
 * @param bufferOffset An optional offset to add/subtract to the element's actual offset.
 */
export function getElementOffset(
  element: HTMLElement,
  bufferOffset?: SkyAffixOffset
): Required<SkyAffixOffset> {
  const bufferOffsetBottom = bufferOffset?.bottom || 0;
  const bufferOffsetLeft = bufferOffset?.left || 0;
  const bufferOffsetRight = bufferOffset?.right || 0;
  const bufferOffsetTop = bufferOffset?.top || 0;

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
    // figure out how to do it based on position, and how offset top relates to top
    const clientRect = element.getBoundingClientRect();
    left = clientRect.left;
    top = clientRect.top;
    right = clientRect.right;
    bottom = clientRect.bottom;

    // if (visualViewport?.height !== window.innerHeight) {
    //   bottom -=
    //     window.innerHeight -
    //     ((window.visualViewport?.height || 0) +
    //       (visualViewport?.offsetTop || 0));
    // }
  }

  bottom -= bufferOffsetBottom;
  left += bufferOffsetLeft;
  right -= bufferOffsetRight;
  top += bufferOffsetTop;

  return {
    bottom,
    left,
    right,
    top,
  };
}

// function viewportOffset(offset: DOMRect) {
//   return { y: -offset.top, x: -offset.left };
// }

export function getOverflowParents(child: HTMLElement): HTMLElement[] {
  const bodyElement = window.document.body;
  const results = [bodyElement];

  let parentElement = child?.parentNode;

  // goes up the list of parents to see if ANY of them are overflow in a way where part of it might be hidden
  while (
    parentElement !== undefined &&
    parentElement !== bodyElement &&
    parentElement instanceof HTMLElement
  ) {
    // MIGHT HAVE TO CHANGE THIS
    const overflowY = window
      .getComputedStyle(parentElement, undefined)
      .overflowY.toLowerCase();

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
  offset: Required<SkyAffixOffset>,
  bufferOffset?: SkyAffixOffset
): boolean {
  const parentOffset = getElementOffset(parent, bufferOffset);
  // drawRect(offset);
  return !(
    parentOffset.top > offset.top ||
    parentOffset.right < offset.right ||
    parentOffset.bottom < offset.bottom ||
    parentOffset.left > offset.left
  );
}

export function isOffsetPartiallyVisibleWithinParent(
  parent: HTMLElement,
  offset: Required<SkyAffixOffset>,
  bufferOffset?: SkyAffixOffset
): boolean {
  const parentOffset = getElementOffset(parent, bufferOffset);
  // drawRect(offset);
  return !(
    parentOffset.top >= offset.bottom ||
    parentOffset.right <= offset.left ||
    parentOffset.bottom <= offset.top ||
    parentOffset.left >= offset.right
  );
}

// function drawRect(offset: Required<SkyAffixOffset>): void {
//   let canvas = document.createElement('canvas');
//   canvas.style.width = '100%';
//   canvas.style.height = '100%';
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   canvas.style.position = 'absolute';
//   canvas.style.left = '0';
//   canvas.style.top = '0';
//   canvas.style.zIndex = '100000';
//   document.body.appendChild(canvas);
//   let rend = canvas.getContext('2d');
//   rend?.rect(offset.left, offset.top, 168, 108);
//   rend?.stroke();
// }
