import {
  NgModule
} from '@angular/core';

import {
  MyLibrarySampleModule
} from './modules/sample';

export * from './modules/sample';

@NgModule({
  exports: [
    MyLibrarySampleModule
  ]
})
export class MyLibraryModule { }
