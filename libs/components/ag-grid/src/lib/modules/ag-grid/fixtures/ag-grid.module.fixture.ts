import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyDataManagerModule } from '@skyux/data-manager';

import { AgGridModule } from 'ag-grid-angular';

import { SkyAgGridModule } from '../ag-grid.module';
import { SkyAgGridCellRendererCurrencyModule } from '../cell-renderers/cell-renderer-currency/cell-renderer-currency.module';
import { SkyAgGridCellValidatorModule } from '../cell-validator/ag-grid-cell-validator.module';

import { SkyAgGridCellValidatorTooltipFixtureComponent } from './ag-grid-cell-validator-tooltip.component.fixture';
import { SkyAgGridDataManagerFixtureComponent } from './ag-grid-data-manager.component.fixture';
import { SkyAgGridRowDeleteFixtureComponent } from './ag-grid-row-delete.component.fixture';
import { SkyAgGridFixtureComponent } from './ag-grid.component.fixture';
import {
  FirstInlineHelpComponent,
  SecondInlineHelpComponent,
} from './inline-help.component';

@NgModule({
  imports: [
    AgGridModule,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyAgGridCellRendererCurrencyModule,
    SkyAgGridCellValidatorModule,
    NoopAnimationsModule,
  ],
  declarations: [
    SkyAgGridDataManagerFixtureComponent,
    SkyAgGridFixtureComponent,
    SkyAgGridRowDeleteFixtureComponent,
    SkyAgGridCellValidatorTooltipFixtureComponent,
    FirstInlineHelpComponent,
    SecondInlineHelpComponent,
  ],
  exports: [
    SkyAgGridDataManagerFixtureComponent,
    SkyAgGridFixtureComponent,
    SkyAgGridRowDeleteFixtureComponent,
    SkyAgGridCellValidatorTooltipFixtureComponent,
    FirstInlineHelpComponent,
    SecondInlineHelpComponent,
  ],
})
export class SkyAgGridFixtureModule {}
