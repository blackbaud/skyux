import { NgModule } from '@angular/core';

import { HelpKeyModule } from './modules/help-key';
import { BBHelpSharedModule } from './modules/shared';
import { HelpModule } from './modules/help';
import { BBHelpDisableWidgetDirective } from './modules/help-directive/disable.directive';

export * from './modules/shared';

@NgModule({
  declarations: [
    BBHelpDisableWidgetDirective
  ],
  exports: [
    HelpKeyModule,
    HelpModule,
    BBHelpSharedModule,
    BBHelpDisableWidgetDirective
  ]
})
export class BBHelpModule { }
