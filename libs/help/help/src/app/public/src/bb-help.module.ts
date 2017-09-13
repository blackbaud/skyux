import { NgModule } from '@angular/core';

import { HelpKeyModule } from './modules/help-key';
import { BBHelpSharedModule } from './modules/shared';
import { TestButtonModule } from './modules/test-button';

export * from './modules/shared';

@NgModule({
  exports: [
    HelpKeyModule,
    TestButtonModule,
    BBHelpSharedModule
  ]
})
export class BBHelpModule { }
