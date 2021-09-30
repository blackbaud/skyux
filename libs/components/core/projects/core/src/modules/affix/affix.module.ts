import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyAffixDirective
} from './affix.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    SkyAffixDirective
  ],
  declarations: [
    SkyAffixDirective
  ]
})
export class SkyAffixModule { }
