import { ViewportRuler } from '@angular/cdk/overlay';

import { SkyAffixOffset } from './affix-offset';
import { AffixRect } from './affix-rect';

function useViewportForBounds(element: HTMLElement): boolean {
  return 'BODY' === element.tagName;
}

/**
 * Returns the offset values of a given element.
 * @param element The HTML element.
 * @param bufferOffset An optional offset to add/subtract to the element's actual offset.
 */
export function getElementOffset(
  element: HTMLElement,
  bufferOffset?: SkyAffixOffset,
): Required<SkyAffixOffset> {
  const bufferOffsetBottom = bufferOffset?.bottom || 0;
  const bufferOffsetLeft = bufferOffset?.left || 0;
  const bufferOffsetRight = bufferOffset?.right || 0;
  const bufferOffsetTop = bufferOffset?.top || 0;

  let top: number;
  let left: number;
  let right: number;
  let bottom: number;

  const clientRect = element.getBoundingClientRect();
  left = clientRect.left;
  top = clientRect.top;
  right = clientRect.right;
  bottom = clientRect.bottom;

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

/**
 * Returns an AffixRect that represents the outer dimensions of a given element.
 */
export function getOuterRect(element: HTMLElement): Required<AffixRect> {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element, undefined);
  const marginTop = parseFloat(computedStyle.marginTop);
  const marginLeft = parseFloat(computedStyle.marginLeft);
  const marginRight = parseFloat(computedStyle.marginRight);
  const marginBottom = parseFloat(computedStyle.marginBottom);

  return {
    top: rect.top - marginTop,
    left: rect.left - marginLeft,
    bottom: rect.top + rect.height + marginBottom,
    right: rect.left + rect.width + marginLeft + marginRight,
    width: rect.width + marginLeft + marginRight,
    height: rect.height + marginTop + marginBottom,
  };
}

/**
 * Returns the visible rect for a given element.
 */
export function getVisibleRectForElement(
  viewportRuler: ViewportRuler,
  element: HTMLElement,
): Required<AffixRect> {
  const elementRect = getOuterRect(element);
  const viewportRect = viewportRuler.getViewportRect();

  const visibleRect = {
    top: Math.max(elementRect.top, 0),
    left: Math.max(elementRect.left, 0),
    bottom: Math.min(elementRect.bottom, viewportRect.height),
    right: Math.min(elementRect.right, viewportRect.width),
  };

  return {
    ...visibleRect,
    width: visibleRect.right - visibleRect.left,
    height: visibleRect.bottom - visibleRect.top,
  };
}

export function getOverflowParents(child: HTMLElement): HTMLElement[] {
  const bodyElement = window.document.body;
  const results = [];

  let parentElement = child?.parentNode;

  while (parentElement !== undefined && parentElement instanceof HTMLElement) {
    if (parentElement.matches('body')) {
      break;
    }

    const computedStyle = window.getComputedStyle(parentElement, undefined);
    const overflowY = computedStyle.overflowY.toLowerCase();

    const largerThanTheDocumentElement =
      window.document.documentElement.scrollWidth < parentElement.scrollWidth ||
      window.document.documentElement.scrollHeight < parentElement.scrollHeight;
    const hasOverflowRules =
      overflowY === 'auto' || overflowY === 'hidden' || overflowY === 'scroll';

    if (largerThanTheDocumentElement || hasOverflowRules) {
      results.push(parentElement);
    }
    if (computedStyle.position === 'fixed') {
      break;
    }

    parentElement = parentElement.parentNode;
  }

  results.push(bodyElement);

  return results;
}

/**
 * Confirms offset is fully visible within a parent element.
 */
export function isOffsetFullyVisibleWithinParent(
  viewportRuler: ViewportRuler,
  parent: HTMLElement,
  offset: Required<SkyAffixOffset>,
  bufferOffset?: SkyAffixOffset,
): boolean {
  let parentOffset: Required<SkyAffixOffset>;

  if (useViewportForBounds(parent)) {
    const viewportRect = viewportRuler.getViewportRect();
    parentOffset = {
      top: 0,
      left: 0,
      right: viewportRect.width,
      bottom: viewportRect.height,
    };
  } else if (bufferOffset) {
    parentOffset = getElementOffset(parent, bufferOffset);
  } else {
    parentOffset = getVisibleRectForElement(viewportRuler, parent);
  }

  return (
    parentOffset.top <= offset.top &&
    parentOffset.right >= offset.right &&
    parentOffset.bottom >= offset.bottom &&
    parentOffset.left <= offset.left
  );
}

export function isOffsetPartiallyVisibleWithinParent(
  viewportRuler: ViewportRuler,
  parent: HTMLElement,
  offset: Required<SkyAffixOffset>,
  bufferOffset?: SkyAffixOffset,
): boolean {
  let parentOffset: Required<SkyAffixOffset>;
  if (useViewportForBounds(parent)) {
    const viewportRect = viewportRuler.getViewportRect();
    parentOffset = {
      top: 0,
      left: 0,
      right: viewportRect.width,
      bottom: viewportRect.height,
    };
  } else if (bufferOffset) {
    parentOffset = getElementOffset(parent, bufferOffset);
  } else {
    parentOffset = getVisibleRectForElement(viewportRuler, parent);
  }

  return !(
    parentOffset.top >= offset.bottom ||
    parentOffset.right <= offset.left ||
    parentOffset.bottom <= offset.top ||
    parentOffset.left >= offset.right
  );
}
