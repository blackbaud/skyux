import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAffixModule } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyTextHighlightModule } from '@skyux/indicators';
import { SkyInlineDeleteModule } from '@skyux/layout';
import { SkyPopoverModule } from '@skyux/popovers';

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
    DragDropModule,
    FormsModule,
    SkyAffixModule,
    SkyCheckboxModule,
    SkyGridsResourcesModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyInlineDeleteModule,
    SkyPopoverModule,
    SkyTextHighlightModule,
  ],
  exports: [SkyGridComponent, SkyGridColumnComponent],
})
export class SkyGridModule {}
