import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';

import { SkyAgGridResourcesModule } from '../shared/sky-ag-grid-resources.module';

import { SkyAgGridDataManagerAdapterDirective } from './ag-grid-data-manager-adapter.directive';
import { SkyAgGridRowDeleteDirective } from './ag-grid-row-delete.directive';
import { SkyAgGridWrapperComponent } from './ag-grid-wrapper.component';

@NgModule({
  imports: [
    AgGridAngular,
    CommonModule,
    SkyAgGridDataManagerAdapterDirective,
    SkyAgGridResourcesModule,
    SkyAgGridRowDeleteDirective,
    SkyAgGridWrapperComponent,
  ],
  exports: [
    SkyAgGridDataManagerAdapterDirective,
    SkyAgGridRowDeleteDirective,
    SkyAgGridWrapperComponent,
  ],
})
export class SkyAgGridModule {}
