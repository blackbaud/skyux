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

import { DragulaModule } from 'ng2-dragula';

import { SkyListBuilderViewGridsResourcesModule } from '../shared/sky-list-builder-view-grids-resources.module';

import { SkyGridCellComponent } from './grid-cell.component';
import { SkyGridColumnLegacyComponent } from './grid-column.component';
import { SkyGridLegacyComponent } from './grid.component';

/**
 * @deprecated `SkyGridComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
 */
@NgModule({
  declarations: [
    SkyGridLegacyComponent,
    SkyGridColumnLegacyComponent,
    SkyGridCellComponent,
  ],
  imports: [
    CommonModule,
    DragulaModule,
    FormsModule,
    SkyAffixModule,
    SkyCheckboxModule,
    SkyListBuilderViewGridsResourcesModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyInlineDeleteModule,
    SkyPopoverModule,
    SkyTextHighlightModule,
  ],
  exports: [SkyGridLegacyComponent, SkyGridColumnLegacyComponent],
})
export class SkyGridLegacyModule {}
