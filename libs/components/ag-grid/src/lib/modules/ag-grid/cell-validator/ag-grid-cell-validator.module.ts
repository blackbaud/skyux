import { NgTemplateOutlet } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyPopoverModule } from '@skyux/popovers';

import { SkyAgGridCellValidatorTooltipComponent } from './ag-grid-cell-validator-tooltip.component';

@NgModule({
  declarations: [SkyAgGridCellValidatorTooltipComponent],
  exports: [SkyAgGridCellValidatorTooltipComponent],
  imports: [SkyPopoverModule, SkyStatusIndicatorModule, NgTemplateOutlet],
})
export class SkyAgGridCellValidatorModule {}
