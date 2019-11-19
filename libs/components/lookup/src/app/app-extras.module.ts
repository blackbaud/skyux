import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyAutocompleteModule,
  SkyLookupModule,
  SkySearchModule
} from './public';

@NgModule({
  imports: [
    SkyAutocompleteModule,
    SkyLookupModule,
    SkySearchModule
  ],
  exports: [
    SkyAutocompleteModule,
    SkyLookupModule,
    SkySearchModule,
    SkyAppLinkModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
