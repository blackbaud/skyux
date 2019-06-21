import {
  ElementRef,
  Injectable,
  Renderer2
} from '@angular/core';

import {
  SkyWindowRefService
} from '@skyux/core';

import {
  SkyPopoverAdapterArrowCoordinates,
  SkyPopoverAdapterCoordinates,
  SkyPopoverAdapterElements,
  SkyPopoverAlignment,
  SkyPopoverPlacement,
  SkyPopoverPosition
} from './types';

@Injectable()
export class SkyPopoverAdapterService {
  constructor(
    private renderer: Renderer2,
    private windowRef: SkyWindowRefService
  ) { }

  public getPopoverPosition(
    elements: SkyPopoverAdapterElements,
    placement: SkyPopoverPlacement,
    alignment: SkyPopoverAlignment
  ): SkyPopoverPosition {
    const max = 4;

    let counter = 0;
    let coords: SkyPopoverAdapterCoordinates;

    do {
      coords = this.getPopoverCoordinates(elements, placement, alignment);

      if (coords.isOutsideViewport) {
        placement = (counter % 2 === 0) ?
          this.getInversePlacement(placement) :
          this.getNextPlacement(placement);
      }

      counter++;
    } while (coords.isOutsideViewport && counter < max);

    if (counter === max && coords.isOutsideViewport) {
      placement = 'fullscreen';
    }

    const arrowCoords = this.getArrowCoordinates(elements, coords, placement);

    const position = this.verifyCoordinatesNearCaller(elements, {
      top: coords.top,
      left: coords.left,
      arrowTop: arrowCoords.top,
      arrowLeft: arrowCoords.left,
      placement,
      alignment
    });

    return position;
  }

  public hidePopover(elem: ElementRef): void {
    this.renderer.addClass(elem.nativeElement, 'sky-popover-hidden');
  }

  public showPopover(elem: ElementRef): void {
    this.renderer.removeClass(elem.nativeElement, 'sky-popover-hidden');
  }

  public isPopoverLargerThanParent(popover: ElementRef): boolean {
    const windowObj = this.windowRef.getWindow();
    const popoverRect = popover.nativeElement.getBoundingClientRect();

    return (
      popoverRect.height >= windowObj.innerHeight ||
      popoverRect.width >= windowObj.innerWidth
    );
  }

  public getParentScrollListeners(
    popover: ElementRef,
    callback: (isVisibleWithinScrollable: boolean) => void
  ): Function[] {
    const bodyElement = this.windowRef.getWindow().document.body;
    const parentElements = this.getScrollableParentElements(popover);

    const listeners = parentElements.map((parentElement: HTMLElement) => {
      const target: any = (parentElement === bodyElement) ? 'window' : parentElement;

      return this.renderer.listen(target, 'scroll', () => {
        const isVisible = (target === 'window')
          ? true
          : this.isVisibleWithinScrollable(target, popover.nativeElement);

        callback(isVisible);
      });
    });

    return listeners;
  }

  private getPopoverCoordinates(
    elements: SkyPopoverAdapterElements,
    placement: SkyPopoverPlacement,
    alignment: SkyPopoverAlignment
  ): SkyPopoverAdapterCoordinates {
    const windowObj = this.windowRef.getWindow();
    const popoverRect = elements.popover.nativeElement.getBoundingClientRect();
    const callerRect = elements.caller.nativeElement.getBoundingClientRect();

    const callerXCenter = callerRect.width / 2;
    const scrollRight = windowObj.innerWidth;
    const scrollBottom = windowObj.innerHeight;

    let top: number;
    let left: number;
    let bleedLeft = 0;
    let bleedRight = 0;
    let bleedTop = 0;
    let bleedBottom = 0;
    let isOutsideViewport = false;

    /* tslint:disable-next-line:switch-default */
    switch (placement) {
      case 'above':
      top = callerRect.top - popoverRect.height;
      bleedTop = top;
      break;

      case 'below':
      top = callerRect.bottom;
      bleedBottom = scrollBottom - (top + popoverRect.height);
      break;

      case 'right':
      left = callerRect.right;
      bleedRight = scrollRight - (left + popoverRect.width);
      break;

      case 'left':
      left = callerRect.left - popoverRect.width;
      bleedLeft = left;
      break;
    }

    if (placement === 'right' || placement === 'left') {
      top = callerRect.top - (popoverRect.height / 2) + (callerRect.height / 2);
      bleedTop = top;
      bleedBottom = scrollBottom - (top + popoverRect.height);
    }

    if (placement === 'above' || placement === 'below') {

      // Make adjustments based on horizontal alignment.
      switch (alignment) {
        default:
        case 'center':
        left = callerRect.left - (popoverRect.width / 2) + callerXCenter;
        break;

        case 'left':
        left = callerRect.left;
        break;

        case 'right':
        left = callerRect.left - popoverRect.width + callerRect.width;
        break;
      }

      bleedLeft = left;
      bleedRight = scrollRight - (left + popoverRect.width);
    }

    // Clipped on left?
    if (bleedLeft < 0) {
      if (placement === 'left') {
        isOutsideViewport = true;
      }

      left = 0;
    }

    // Clipped on right?
    if (bleedRight < 0) {
      if (placement === 'right') {
        isOutsideViewport = true;
      }

      left += bleedRight;
    }

    // Clipped on top?
    if (bleedTop < 0) {
      if (placement === 'above') {
        isOutsideViewport = true;
      }

      top -= bleedTop;
    }

    // Clipped on bottom?
    if (bleedBottom < 0) {
      if (placement === 'below') {
        isOutsideViewport = true;
      }

      top += bleedBottom;
    }

    return {
      top,
      left,
      isOutsideViewport
    };
  }

  private getArrowCoordinates(
    elements: SkyPopoverAdapterElements,
    popoverCoords: SkyPopoverAdapterCoordinates,
    placement: SkyPopoverPlacement
  ): SkyPopoverAdapterArrowCoordinates {
    const callerRect = elements.caller.nativeElement.getBoundingClientRect();
    const popoverRect = elements.popover.nativeElement.getBoundingClientRect();
    const arrowRect = elements.popoverArrow.nativeElement.getBoundingClientRect();
    const callerXCenter = (callerRect.width / 2);
    const callerYCenter = (callerRect.height / 2);

    let top: number;
    let left: number;

    if (placement === 'left' || placement === 'right') {
      top = callerRect.top - popoverCoords.top + callerYCenter;

      if (top < callerYCenter) {
        top = callerYCenter;
      }

      if (top > popoverRect.height - callerYCenter) {
        top = popoverRect.height - callerYCenter;
      }
    }

    if (placement === 'above' || placement === 'below') {
      left = callerRect.left - popoverCoords.left + callerXCenter;

      if (left < arrowRect.width) {
        left = arrowRect.width;
      }

      if (left > popoverRect.width - arrowRect.width) {
        left = popoverRect.width - arrowRect.width;
      }
    }

    return { top, left };
  }

  // This method ensures that the popover remains close to caller element,
  // when the caller element is no longer visible after scrolling.
  private verifyCoordinatesNearCaller(
    elements: SkyPopoverAdapterElements,
    position: SkyPopoverPosition
  ): SkyPopoverPosition {
    const windowObj = this.windowRef.getWindow();
    const callerRect = elements.caller.nativeElement.getBoundingClientRect();
    const popoverRect = elements.popover.nativeElement.getBoundingClientRect();
    const pixelTolerance = 40;

    if (position.placement === 'left' || position.placement === 'right') {
      if (callerRect.top < 0) {
        position.top = callerRect.top;
      }

      if (callerRect.bottom > windowObj.innerHeight) {
        position.top = callerRect.bottom - popoverRect.height;
      }
    }

    if (position.placement === 'above' || position.placement === 'below') {
      if (position.left + pixelTolerance > callerRect.right) {
        position.left = callerRect.right - pixelTolerance;
      }

      if (position.left + popoverRect.width - pixelTolerance < callerRect.left) {
        position.left = callerRect.left - popoverRect.width + pixelTolerance;
      }
    }

    return position;
  }

  private getNextPlacement(placement: SkyPopoverPlacement): SkyPopoverPlacement {
    const placements: SkyPopoverPlacement[] = ['above', 'right', 'below', 'left'];

    let index = placements.indexOf(placement) + 1;
    if (index === placements.length) {
      index = 0;
    }

    return placements[index];
  }

  private getInversePlacement(placement: SkyPopoverPlacement): SkyPopoverPlacement {
    const pairings: any = {
      above: 'below',
      below: 'above',
      right: 'left',
      left: 'right'
    };

    return pairings[placement];
  }

  private getScrollableParentElements(element: ElementRef): Array<HTMLElement> {
    const windowObj = this.windowRef.getWindow();
    const bodyElement = windowObj.document.body;
    const result = [bodyElement];

    let parentElement = element.nativeElement.parentNode;

    while (
      parentElement !== undefined &&
      parentElement !== bodyElement &&
      parentElement instanceof HTMLElement
    ) {
      const overflowY = windowObj.getComputedStyle(parentElement, undefined).overflowY.toLowerCase();
      if (overflowY === 'auto' || overflowY === 'hidden' || overflowY === 'scroll') {
        result.push(parentElement);
      }

      parentElement = parentElement.parentNode;
    }

    return result;
  }

  // Returns true if the popover is visible in the scrollable parent.
  private isVisibleWithinScrollable(container: any, popover: any): boolean {
    const containerRect = container.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const percentageTopVisible = (popoverRect.top === 0) ? 100 : popoverRect.top / containerRect.top * 100;
    const percentageBottomVisible = (containerRect.bottom === 0) ? 100 : containerRect.bottom / popoverRect.bottom * 100;

    return (percentageTopVisible > 95 && percentageBottomVisible > 95);
  }
}
