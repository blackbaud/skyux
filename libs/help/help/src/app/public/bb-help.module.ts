import {
  NgModule
} from '@angular/core';

import {
  HelpKeyModule
} from './modules/help-key/help-key.module';

import {
  HelpModule
} from './modules/help/help.module';

import {
  BBHelpDisableModule
} from './modules/help-directive/disable.module';

import {
  OpenOnClickDirectiveModule
} from './modules/open-on-click-directive/open-on-click.module';

import {
  HelpInitializationService
} from './modules/shared/initialization.service';

@NgModule({
  exports: [
    HelpKeyModule,
    HelpModule,
    BBHelpDisableModule,
    OpenOnClickDirectiveModule
  ],
  providers: [
    HelpInitializationService
  ]
})
export class BBHelpModule { }
