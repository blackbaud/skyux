import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  StacheOmnibarAdapterService
} from '../shared/omnibar-adapter.service';

import {
  StacheWindowRef
} from '../shared/window-ref';

import {
  StacheAffixComponent
} from './affix.component';

import {
  StacheAffixTopDirective
} from './affix-top.directive';

@NgModule({
  declarations: [
    StacheAffixComponent,
    StacheAffixTopDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheAffixComponent,
    StacheAffixTopDirective
  ],
  providers: [
    StacheOmnibarAdapterService,
    StacheWindowRef
  ]
})
export class StacheAffixModule { }
