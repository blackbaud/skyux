import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  DragulaModule
} from 'ng2-dragula';

import {
  SkyAppWindowRef,
  SkyUIConfigService
} from '@skyux/core';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyIconModule,
  SkyTextHighlightModule,
  SkyHelpInlineModule
} from '@skyux/indicators';

import {
  SkyInlineDeleteModule
} from '@skyux/layout';

import {
  SkyPopoverModule
} from '@skyux/popovers';

import {
  SkyGridComponent
} from './grid.component';

import {
  SkyGridColumnComponent
} from './grid-column.component';

import {
  SkyGridCellComponent
} from './grid-cell.component';

import {
  SkyGridsResourcesModule
} from '../shared/grids-resources.module';

@NgModule({
  declarations: [
    SkyGridComponent,
    SkyGridColumnComponent,
    SkyGridCellComponent
  ],
  imports: [
    CommonModule,
    DragulaModule,
    FormsModule,
    SkyCheckboxModule,
    SkyGridsResourcesModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyInlineDeleteModule,
    SkyPopoverModule,
    SkyTextHighlightModule
  ],
  exports: [
    SkyGridComponent,
    SkyGridColumnComponent,
    SkyGridCellComponent
  ],
  providers: [
    SkyAppWindowRef,
    SkyUIConfigService
  ]
})
export class SkyGridModule {
}
