import { NgModule } from '@angular/core';

import { SkyAgGridCellValidatorModule } from '../../cell-validator/ag-grid-cell-validator.module';

import { SkyAgGridCellRendererValidatorTooltipComponent } from './cell-renderer-validator-tooltip.component';

@NgModule({
  declarations: [SkyAgGridCellRendererValidatorTooltipComponent],
  exports: [SkyAgGridCellRendererValidatorTooltipComponent],
  imports: [SkyAgGridCellValidatorModule],
})
export class SkyAgGridCellRendererValidatorTooltipModule {}
