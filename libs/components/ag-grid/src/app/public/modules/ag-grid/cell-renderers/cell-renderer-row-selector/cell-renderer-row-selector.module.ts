import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyAgGridResourcesModule
} from '../../../shared';

import {
  SkyAgGridCellRendererRowSelectorComponent
} from '../cell-renderer-row-selector';

@NgModule({
  imports: [
    SkyAgGridResourcesModule,
    SkyCheckboxModule,
    FormsModule
  ],
  declarations: [
    SkyAgGridCellRendererRowSelectorComponent
  ],
  exports: [
    SkyAgGridCellRendererRowSelectorComponent
  ]
})
export class SkyAgGridCellRendererRowSelectorModule {
}
