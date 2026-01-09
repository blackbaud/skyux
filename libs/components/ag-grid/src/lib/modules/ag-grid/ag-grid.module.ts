import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';

import { SkyAgGridResourcesModule } from '../shared/sky-ag-grid-resources.module';

import { SkyAgGridDataManagerAdapterDirective } from './ag-grid-data-manager-adapter.directive';
import { SkyAgGridRowDeleteDirective } from './ag-grid-row-delete.directive';
import { SkyAgGridWrapperComponent } from './ag-grid-wrapper.component';

/**
 * Provides `SkyAgGridWrapperComponent` and `SkyAgGridRowDeleteDirective`, but to use
 * AG Grid in your application, you must also load `AgGridAngular` from `ag-grid-angular` and
 * `ModuleRegistry` from `ag-grid-community`. For more information, see
 * [AG Grid modules](https://www.ag-grid.com/angular-data-grid/modules/).
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
