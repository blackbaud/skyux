import { NgModule } from '@angular/core';

import { LibrarySampleModule } from './modules/sample';
import { BBHelpSharedModule } from './modules/shared';

export * from './modules/shared';

@NgModule({
  exports: [
    LibrarySampleModule,
    BBHelpSharedModule
  ]
})
export class BBHelpModule { }
