import { ElementRef } from '@angular/core';

import { SkyResizeObserverMediaQueryService } from '../resize-observer/resize-observer-media-query.service';

import { SkyMediaQueryServiceBase } from './media-query-service-base';

/**
 * @internal
 */
export interface SkyMediaQueryServiceOverride extends SkyMediaQueryServiceBase {
  /**
   * Sets the container element to watch. The `SkyResizeObserverMediaQueryService`
   * will only observe one element at a time. Any previous subscriptions will be
   * unsubscribed when a new element is observed.
   */
  observe?: (
    element: ElementRef,
    options?: {
      updateResponsiveClasses?: boolean;
    },
  ) => SkyResizeObserverMediaQueryService;

  /**
   * Stop watching the container element and remove any added classes.
   */
  unobserve?: () => void;
}
