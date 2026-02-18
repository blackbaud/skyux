import { InjectionToken, Provider, inject } from '@angular/core';
import { SkyIdService } from '@skyux/core';

export const SKY_CHART_HEADER_ID = new InjectionToken<string>(
  'SKY_CHART_HEADER_ID',
);

export function provideSkyChartHeaderId(): Provider {
  return {
    provide: SKY_CHART_HEADER_ID,
    useFactory(): string {
      const idService = inject(SkyIdService);
      return idService.generateId();
    },
  };
}
