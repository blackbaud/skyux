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
  SkyDataManagerModule
} from '@skyux/data-manager';

import {
  SkyIconModule,
  SkyTokensModule
} from '@skyux/indicators';

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
    SkyDataManagerModule,
    SkyIconModule,
    SkyInfiniteScrollModule,
    SkyLookupResourcesModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkyThemeModule,
    SkyTokensModule,
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
