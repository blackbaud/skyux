import { InjectionToken, Provider, inject } from '@angular/core';
import { SkyIdService } from '@skyux/core';

/**
 * Injection token for the chart header ID, used to associate the chart header with its content for accessibility purposes.
 */
export const SKY_CHART_HEADER_ID = new InjectionToken<string>(
  'SKY_CHART_HEADER_ID',
);

/**
 * Factory function to provide a unique ID for the chart header.
 */
export function provideSkyChartHeaderId(): Provider {
  return {
    provide: SKY_CHART_HEADER_ID,
    useFactory(): string {
      const idService = inject(SkyIdService);
      return idService.generateId();
    },
  };
}
