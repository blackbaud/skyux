import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAffixModule, SkyOverlayModule } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import {
  SkyHelpInlineModule,
  SkyIconModule,
  SkyTextHighlightModule,
} from '@skyux/indicators';
import { SkyInlineDeleteModule } from '@skyux/layout';
import { SkyPopoverModule } from '@skyux/popovers';

import { DragulaModule } from 'ng2-dragula';

import { SkyGridsResourcesModule } from '../shared/sky-grids-resources.module';

import { SkyGridCellComponent } from './grid-cell.component';
import { SkyGridColumnComponent } from './grid-column.component';
import { SkyGridComponent } from './grid.component';

/**
 * @deprecated `SkyGridComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
 */
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
    SkyGridsResourcesModule,
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
