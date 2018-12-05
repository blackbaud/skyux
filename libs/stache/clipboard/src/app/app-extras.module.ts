import {
  NgModule
} from '@angular/core';

import {
  SkyClipboardModule
} from './public';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    SkyClipboardModule
  ],
  exports: [
    SkyClipboardModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
