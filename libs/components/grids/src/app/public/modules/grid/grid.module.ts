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
    FormsModule
  ],
  exports: [
    SkyGridComponent,
    SkyGridColumnComponent,
    SkyGridCellComponent
  ]
})
export class SkyGridModule {
}
