import { Component, viewChild } from '@angular/core';

import { SkyAgGridCellValidatorTooltipComponent } from '../cell-validator/ag-grid-cell-validator-tooltip.component';
import { SkyCellRendererValidatorParams } from '../types/cell-renderer-validator-params';

@Component({
  selector: 'sky-ag-grid-cell-validator-tooltip-fixture',
  templateUrl: 'ag-grid-cell-validator-tooltip.component.fixture.html',
  imports: [SkyAgGridCellValidatorTooltipComponent],
})
export class SkyAgGridCellValidatorTooltipFixtureComponent {
  public readonly tooltip = viewChild(SkyAgGridCellValidatorTooltipComponent);

  public parameters: SkyCellRendererValidatorParams | undefined;
}
