import {
  NgModule
} from '@angular/core';

import {
  MyLibraryModule
} from './public';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    MyLibraryModule
  ],
  exports: [
    MyLibraryModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
