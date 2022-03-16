import {
  NgModule
} from '@angular/core';

import {
  BBHelpDisableWidgetDirective
} from './disable.directive';

@NgModule({
  declarations: [
    BBHelpDisableWidgetDirective
  ],
  exports: [
    BBHelpDisableWidgetDirective
  ]
})
export class BBHelpDisableModule { }
