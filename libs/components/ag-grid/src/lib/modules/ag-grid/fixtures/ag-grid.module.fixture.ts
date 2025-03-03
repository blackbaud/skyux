import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyDataManagerModule } from '@skyux/data-manager';

import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import { SkyAgGridModule } from '../ag-grid.module';

import { SkyAgGridCellValidatorTooltipFixtureComponent } from './ag-grid-cell-validator-tooltip.component.fixture';
import { SkyAgGridDataManagerFixtureComponent } from './ag-grid-data-manager.component.fixture';
import { SkyAgGridRowDeleteFixtureComponent } from './ag-grid-row-delete.component.fixture';
import { SkyAgGridFixtureComponent } from './ag-grid.component.fixture';
import {
  FirstInlineHelpComponent,
  SecondInlineHelpComponent,
} from './inline-help.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  imports: [
    AgGridModule,
    SkyAgGridModule,
    SkyDataManagerModule,
    NoopAnimationsModule,
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
