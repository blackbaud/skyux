import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheAffixComponent } from './affix.component';

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
