import { NgModule } from '@angular/core';

import { HelpKeyModule } from './modules/help-key';
import { BBHelpSharedModule } from './modules/shared';

export * from './modules/shared';

@NgModule({
  exports: [
    HelpKeyModule,
    BBHelpSharedModule
  ]
})
export class BBHelpModule { }
