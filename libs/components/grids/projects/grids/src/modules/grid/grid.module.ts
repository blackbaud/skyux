import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { DragulaModule } from 'ng2-dragula';

import { SkyAffixModule, SkyOverlayModule } from '@skyux/core';

import { SkyCheckboxModule } from '@skyux/forms';

import {
  SkyIconModule,
  SkyTextHighlightModule,
  SkyHelpInlineModule,
} from '@skyux/indicators';

import { SkyInlineDeleteModule } from '@skyux/layout';

import { SkyPopoverModule } from '@skyux/popovers';

import { SkyGridComponent } from './grid.component';

import { SkyGridColumnComponent } from './grid-column.component';

import { SkyGridCellComponent } from './grid-cell.component';

import { SkyuxGridsResourcesModule } from '../shared/skyux-grids-resources.module';

@NgModule({
  declarations: [
    SkyGridComponent,
    SkyGridColumnComponent,
    SkyGridCellComponent,
  ],
  imports: [
    CommonModule,
    DragulaModule,
    FormsModule,
    SkyAffixModule,
    SkyCheckboxModule,
    SkyuxGridsResourcesModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyInlineDeleteModule,
    SkyOverlayModule,
    SkyPopoverModule,
    SkyTextHighlightModule,
  ],
  exports: [SkyGridComponent, SkyGridColumnComponent],
})
export class SkyGridModule {}
