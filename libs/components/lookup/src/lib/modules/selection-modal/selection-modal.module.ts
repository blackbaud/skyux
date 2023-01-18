import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule, SkyWaitModule } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyInfiniteScrollModule, SkyRepeaterModule } from '@skyux/lists';
import { SkyModalModule } from '@skyux/modals';
import { SkyThemeModule } from '@skyux/theme';

import { SkySearchModule } from '../search/search.module';

import { SkySelectionModalItemSelectedPipe } from './selection-modal-item-selected.pipe';
import { SkySelectionModalComponent } from './selection-modal.component';

@NgModule({
  declarations: [SkySelectionModalComponent, SkySelectionModalItemSelectedPipe],
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyI18nModule,
    SkyIconModule,
    SkyInfiniteScrollModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkyThemeModule,
    SkyToolbarModule,
    SkyViewkeeperModule,
    SkyWaitModule,
  ],
})
export class SkySelectionModalModule {}
