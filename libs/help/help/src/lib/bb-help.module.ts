import { NgModule } from '@angular/core';

import { BBHelpDisableModule } from './modules/help-directive/disable.module';
import { HelpKeyModule } from './modules/help-key/help-key.module';
import { HelpModule } from './modules/help/help.module';
import { OpenOnClickDirectiveModule } from './modules/open-on-click-directive/open-on-click.module';

@NgModule({
  exports: [
    HelpKeyModule,
    HelpModule,
    BBHelpDisableModule,
    OpenOnClickDirectiveModule,
  ],
})
export class BBHelpModule {}
