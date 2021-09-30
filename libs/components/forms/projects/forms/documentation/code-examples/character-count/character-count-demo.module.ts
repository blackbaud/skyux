import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyCharacterCounterModule,
  SkyInputBoxModule
} from 'projects/forms/src/public-api';

import {
  CharacterCountDemoComponent
} from './character-count-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCharacterCounterModule,
    SkyIdModule,
    SkyInputBoxModule
  ],
  declarations: [
    CharacterCountDemoComponent
  ],
  exports: [
    CharacterCountDemoComponent
  ]
})

export class SkyCharacterCountDemoModule { }
