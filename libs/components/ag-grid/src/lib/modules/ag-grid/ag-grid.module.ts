import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';

import { SkyAgGridResourcesModule } from '../shared/sky-ag-grid-resources.module';

import { SkyAgGridDataManagerAdapterDirective } from './ag-grid-data-manager-adapter.directive';
import { SkyAgGridRowDeleteDirective } from './ag-grid-row-delete.directive';
import { SkyAgGridWrapperComponent } from './ag-grid-wrapper.component';

/**
 * Provides `SkyAgGridWrapperComponent` and `SkyAgGridRowDeleteDirective`.
 *
 * When loading this module, be sure to also load `AgGridAngular` from `ag-grid-angular` and
 * the `ModuleRegistry` from `ag-grid-community` in order to use AG Grid in your application.
 * See [AG Grid modules](https://www.ag-grid.com/angular-data-grid/modules/) for more information.
 *
 * @example
 * ```typescript
 * ModuleRegistry.registerModules([AllCommunityModule]);
 * ```
 */
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
