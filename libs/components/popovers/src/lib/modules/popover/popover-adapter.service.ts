import { Injectable } from '@angular/core';

import { SkyPopoverAdapterArrowCoordinates } from './types/popover-adapter-arrow-coordinates';
import { SkyPopoverAdapterElements } from './types/popover-adapter-elements';
import { SkyPopoverPlacement } from './types/popover-placement';

/**
 * @internal
 */
@Injectable()
export class SkyPopoverAdapterService {
  public getArrowCoordinates(
    elements: SkyPopoverAdapterElements,
    placement: SkyPopoverPlacement,
    themeName?: string
  ): SkyPopoverAdapterArrowCoordinates {
    const callerRect = elements.caller.nativeElement.getBoundingClientRect();
    const popoverRect = elements.popover.nativeElement.getBoundingClientRect();
    const arrowRect =
      elements.popoverArrow.nativeElement.getBoundingClientRect();

    const pixelTolerance = 20;

    let top: number;
    let left: number;

    if (placement === 'above' || placement === 'below') {
      left = callerRect.left + callerRect.width * 0.5;

      // Make sure the arrow never detaches from the popover.
      if (left - pixelTolerance < popoverRect.left) {
        left = popoverRect.left + pixelTolerance;
      } else if (left + pixelTolerance > popoverRect.right) {
        left = popoverRect.right - pixelTolerance;
      }

      if (placement === 'above') {
        if (themeName !== 'modern') {
          top = callerRect.top - arrowRect.height;
        } else {
          top = callerRect.top - arrowRect.height + 5;
        }
      } else {
        if (themeName !== 'modern') {
          top = callerRect.bottom;
        } else {
          top = callerRect.bottom + 4;
        }
      }
    } else {
      top = callerRect.top + callerRect.height * 0.5;

      // Make sure the arrow never detaches from the popover.
      if (top - pixelTolerance < popoverRect.top) {
        top = popoverRect.top + pixelTolerance;
      } else if (top + pixelTolerance > popoverRect.bottom) {
        top = popoverRect.bottom - pixelTolerance;
      }

      if (placement === 'left') {
        if (themeName !== 'modern') {
          left = callerRect.left - arrowRect.width;
        } else {
          left = callerRect.left - arrowRect.width + 5;
        }
      } else {
        if (themeName !== 'modern') {
          left = callerRect.right;
        } else {
          left = callerRect.right + 4;
        }
      }
    }

    return { top, left };
  }
}
