import { NgModule } from '@angular/core';

import { LibrarySampleModule } from './modules/sample';
import { LibrarySharedModule } from './modules/shared';

export * from './modules/shared';

@NgModule({
  exports: [
    LibrarySampleModule,
    LibrarySharedModule
  ]
})
export class LibraryModule { }
