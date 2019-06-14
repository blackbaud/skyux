import {
  NgModule
} from '@angular/core';

import {
  BBHelpDisableWidgetDirective
} from './disable.directive';

import {
  HelpWidgetService
} from '../shared/widget.service';

@NgModule({
  declarations: [
    BBHelpDisableWidgetDirective
  ],
  providers: [
    HelpWidgetService
  ],
  exports: [
    BBHelpDisableWidgetDirective
  ]
})
export class BBHelpDisableModule { }
