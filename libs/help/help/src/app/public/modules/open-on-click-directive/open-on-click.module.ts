import {
  NgModule
} from '@angular/core';

import {
  BBHelpOpenOnClickDirective
} from './open-on-click.directive';

import {
  HelpWidgetService
} from '../shared/widget.service';

@NgModule({
  declarations: [
    BBHelpOpenOnClickDirective
  ],
  providers: [
    HelpWidgetService
  ],
  exports: [
    BBHelpOpenOnClickDirective
  ]
})
export class OpenOnClickDirectiveModule { }
