import { Component } from '@angular/core';
import { SkyCellRendererValidatorParams } from '../types/cell-renderer-validator-params';

@Component({
  selector: 'sky-ag-grid-cell-validator-tooltip-fixture',
  templateUrl: 'ag-grid-cell-validator-tooltip.component.fixture.html',
})
export class SkyAgGridCellValidatorTooltipFixtureComponent {
  public parameters: SkyCellRendererValidatorParams;
}
