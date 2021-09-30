import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  CharacterCountTestComponent
} from './character-count.component.fixture';

import {
  CharacterCountNoIndicatorTestComponent
} from './character-count-no-indicator.component.fixture';

import {
  SkyCharacterCounterModule
} from '../character-counter.module';

@NgModule({
  declarations: [
    CharacterCountNoIndicatorTestComponent,
    CharacterCountTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyCharacterCounterModule,
    ReactiveFormsModule
  ],
  exports: [
    CharacterCountNoIndicatorTestComponent,
    CharacterCountTestComponent
  ]
})
export class CharacterCountTestModule { }
