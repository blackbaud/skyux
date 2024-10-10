import { ElementRef } from '@angular/core';

import { SkyResizeObserverMediaQueryService } from '../resize-observer/resize-observer-media-query.service';

import { SkyMediaQueryServiceBase } from './media-query-service-base';

/**
 * @internal
 */
export interface SkyMediaQueryServiceOverride extends SkyMediaQueryServiceBase {
  observe?: (
    element: ElementRef,
    options?: {
      updateResponsiveClasses?: boolean;
    },
  ) => SkyResizeObserverMediaQueryService;
  unobserve?: () => void;
}
