import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyAffixDirective
} from './affix.directive';

import {
  SkyAffixService
} from './affix.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    SkyAffixDirective
  ],
  declarations: [
    SkyAffixDirective
  ],
  providers: [
    SkyAffixService
  ]
})
export class SkyAffixModule { }
