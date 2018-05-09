import { NgModule } from '@angular/core';

import { HelpKeyModule } from './modules/help-key';
import { BBHelpSharedModule } from './modules/shared';
import { HelpModule } from './modules/help';
import { BBHelpDisableWidgetDirective } from './modules/help-directive/disable.directive';
import { BBHelpOpenOnClickDirective } from './modules/open-on-click-directive/open-on-click.directive';

export * from './modules/shared';

@NgModule({
  declarations: [
    BBHelpDisableWidgetDirective,
    BBHelpOpenOnClickDirective
  ],
  exports: [
    HelpKeyModule,
    HelpModule,
    BBHelpSharedModule,
    BBHelpDisableWidgetDirective,
    BBHelpOpenOnClickDirective
  ]
})
export class BBHelpModule { }
