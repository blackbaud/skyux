import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AgGridModule } from 'ag-grid-angular';

import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyAgGridCellRendererCurrencyModule } from '../cell-renderers/cell-renderer-currency/cell-renderer-currency.module';
import { SkyAgGridCellValidatorModule } from '../cell-validator/ag-grid-cell-validator.module';
import { SkyAgGridCellValidatorTooltipFixtureComponent } from './ag-grid-cell-validator-tooltip.component.fixture';

import { SkyAgGridFixtureComponent } from './ag-grid.component.fixture';

import { SkyAgGridModule } from '../ag-grid.module';

import { SkyAgGridDataManagerFixtureComponent } from './ag-grid-data-manager.component.fixture';

import { SkyAgGridRowDeleteFixtureComponent } from './ag-grid-row-delete.component.fixture';

@NgModule({
  imports: [
    AgGridModule,
    CommonModule,
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
  ],
  exports: [
    SkyAgGridDataManagerFixtureComponent,
    SkyAgGridFixtureComponent,
    SkyAgGridRowDeleteFixtureComponent,
    SkyAgGridCellValidatorTooltipFixtureComponent,
  ],
})
export class SkyAgGridFixtureModule {}
