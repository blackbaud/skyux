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
} from 'ng2-dragula/ng2-dragula';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyIconModule,
  SkyTextHighlightModule
} from '@skyux/indicators';

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
    SkyTextHighlightModule,
    SkyIconModule,
    DragulaModule,
    FormsModule,
    SkyCheckboxModule,
    SkyGridsResourcesModule
  ],
  exports: [
    SkyGridComponent,
    SkyGridColumnComponent,
    SkyGridCellComponent
  ]
})
export class SkyGridModule {
}
