import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyI18nModule } from '@skyux/i18n';
import {
  SkyIconModule,
  SkyTokensModule,
  SkyWaitModule,
} from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyInfiniteScrollModule, SkyRepeaterModule } from '@skyux/lists';
import { SkyModalModule } from '@skyux/modals';
import { SkyThemeModule } from '@skyux/theme';

import { SkyAutocompleteModule } from '../autocomplete/autocomplete.module';
import { SkySearchModule } from '../search/search.module';
import { SkyLookupResourcesModule } from '../shared/sky-lookup-resources.module';

import { SkyLookupItemSelectedPipe } from './lookup-item-selected.pipe';
import { SkyLookupShowMoreAsyncModalComponent } from './lookup-show-more-async-modal.component';
import { SkyLookupShowMoreModalComponent } from './lookup-show-more-modal.component';
import { SkyLookupComponent } from './lookup.component';

@NgModule({
  declarations: [
    SkyLookupComponent,
    SkyLookupItemSelectedPipe,
    SkyLookupShowMoreAsyncModalComponent,
    SkyLookupShowMoreModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAutocompleteModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyInfiniteScrollModule,
    SkyI18nModule,
    SkyLookupResourcesModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkyThemeModule,
    SkyTokensModule,
    SkyToolbarModule,
    SkyViewkeeperModule,
    SkyWaitModule,
  ],
  entryComponents: [
    SkyLookupShowMoreAsyncModalComponent,
    SkyLookupShowMoreModalComponent,
  ],
  exports: [SkyLookupComponent],
})
export class SkyLookupModule {}
