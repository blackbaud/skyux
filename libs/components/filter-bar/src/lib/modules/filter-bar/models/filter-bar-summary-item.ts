import { TemplateRef } from '@angular/core';
import { SkyNumericOptions } from '@skyux/core';

export interface SkyFilterBarSummaryItem {
  value: number;
  label: string;
  valueFormat?: SkyNumericOptions;
  helpKey?: string;
  helpPopoverContent?: string | TemplateRef<unknown>;
  helpPopoverTitle?: string;
}
