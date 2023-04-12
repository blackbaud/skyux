import { Injectable } from '@angular/core';

import autoScroll from 'dom-autoscroller';

import { SkyRepeaterAutoScrollOptions } from './repeater-auto-scroll-options';
import { SkyRepeaterAutoScroller } from './repeater-auto-scroller';

/**
 * @internal
 */
@Injectable()
export class SkyRepeaterAutoScrollService {
  public autoScroll(
    elements: (HTMLElement | Window)[],
    options: SkyRepeaterAutoScrollOptions
  ): SkyRepeaterAutoScroller {
    return autoScroll(elements, options);
  }
}
