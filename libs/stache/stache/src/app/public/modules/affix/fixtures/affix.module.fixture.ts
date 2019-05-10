import {
  NgModule
} from '@angular/core';

import {
  StacheCodeModule
} from '../../code/code.module';

import {
  StacheAffixModule
} from '../affix.module';

import {
  AffixTopFixtureComponent
} from './affix-top.component.fixture';

import {
  AffixFixtureComponent
} from './affix.component.fixture';

@NgModule({
  declarations: [
    AffixFixtureComponent,
    AffixTopFixtureComponent
  ],
  imports: [
    StacheCodeModule,
    StacheAffixModule
  ],
  exports: [
    AffixFixtureComponent,
    AffixTopFixtureComponent
  ]
})
export class AffixFixtureModule { }
