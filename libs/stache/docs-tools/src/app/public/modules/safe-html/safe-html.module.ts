import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDocsSafeHtmlComponent
} from './safe-html.component';

@NgModule({
  declarations: [
    SkyDocsSafeHtmlComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyDocsSafeHtmlComponent
  ]
})
export class SkyDocsSafeHtmlModule { }
