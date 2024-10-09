import { ElementRef } from '@angular/core';

import { SkyResizeObserverMediaQueryService } from '../resize-observer/resize-observer-media-query.service';

import { SkyMediaQueryServiceBase } from './media-query-service-base';

/**
 * @internal
 */
export abstract class SkyMediaQueryServiceOverride extends SkyMediaQueryServiceBase {
  public abstract observe(
    element: ElementRef,
    options?: {
      updateResponsiveClasses?: boolean;
    },
  ): SkyResizeObserverMediaQueryService;

  public abstract unobserve(): void;
}
