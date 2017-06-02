import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheAffixComponent } from './affix.component';
import { StacheAffixTopDirective } from './affix-top.directive';

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
  ]
})
export class StacheAffixModule { }
