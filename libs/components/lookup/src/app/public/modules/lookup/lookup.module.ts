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
  SkyAppWindowRef,
  SkyViewkeeperModule
} from '@skyux/core';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule,
  SkyTokensModule
} from '@skyux/indicators';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyInfiniteScrollModule,
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyLookupComponent
} from './lookup.component';

import {
  SkyLookupShowMoreModalComponent
} from './lookup-show-more-modal.component';

import {
  SkyAutocompleteModule
} from '../autocomplete/autocomplete.module';

import {
  SkySearchModule
} from '../search/search.module';

import {
  SkyLookupResourcesModule
} from '../shared/lookup-resources.module';

@NgModule({
  declarations: [
    SkyLookupComponent,
    SkyLookupShowMoreModalComponent
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
    SkyViewkeeperModule
  ],
  entryComponents: [
    SkyLookupShowMoreModalComponent
  ],
  exports: [
    SkyLookupComponent
  ],
  providers: [
    SkyAppWindowRef
  ]
})
export class SkyLookupModule { }
