import {
  NgModule
} from '@angular/core';

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
    SkySearchModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
