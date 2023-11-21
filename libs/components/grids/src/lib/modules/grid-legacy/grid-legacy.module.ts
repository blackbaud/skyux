import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAffixModule } from '@skyux/core';
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

import { SkyGridLegacyCellComponent } from './grid-legacy-cell.component';
import { SkyGridLegacyColumnComponent } from './grid-legacy-column.component';
import { SkyGridLegacyComponent } from './grid-legacy.component';

/**
 * @deprecated `SkyGridLegacyComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
 */
@NgModule({
  declarations: [
    SkyGridLegacyComponent,
    SkyGridLegacyColumnComponent,
    SkyGridLegacyCellComponent,
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
    SkyPopoverModule,
    SkyTextHighlightModule,
  ],
  exports: [SkyGridLegacyComponent, SkyGridLegacyColumnComponent],
})
export class SkyGridLegacyModule {}
