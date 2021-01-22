 import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyAgGridResourcesModule
} from '../../../shared/ag-grid-resources.module';

import {
  SkyAgGridCellRendererCurrencyComponent
} from './cell-renderer-currency.component';

import {
  SkyNumericModule
} from '@skyux/core';

@NgModule({
  imports: [
    SkyAgGridResourcesModule,
    FormsModule,
    SkyNumericModule
  ],
  declarations: [
    SkyAgGridCellRendererCurrencyComponent
  ],
  exports: [
    SkyAgGridCellRendererCurrencyComponent
  ]
})
export class SkyAgGridCellRendererCurrencyModule {
}
