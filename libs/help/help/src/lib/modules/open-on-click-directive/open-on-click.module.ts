import {
  NgModule
} from '@angular/core';

import {
  BBHelpOpenOnClickDirective
} from './open-on-click.directive';

@NgModule({
  declarations: [
    BBHelpOpenOnClickDirective
  ],
  exports: [
    BBHelpOpenOnClickDirective
  ]
})
export class OpenOnClickDirectiveModule { }
