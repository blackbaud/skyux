import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HelpWidgetService
} from '../shared/widget.service';

import {
  HelpKeyComponent
} from './help-key.component';

@NgModule({
  declarations: [
    HelpKeyComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HelpKeyComponent
  ],
  providers: [
    HelpWidgetService
  ]
})
export class HelpKeyModule { }
