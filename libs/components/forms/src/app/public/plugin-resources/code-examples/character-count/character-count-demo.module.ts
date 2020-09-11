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
  SkyCharacterCounterModule
} from '@skyux/forms';

import {
  CharacterCountDemoComponent
} from './character-count-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCharacterCounterModule
  ],
  declarations: [
    CharacterCountDemoComponent
  ],
  exports: [
    CharacterCountDemoComponent
  ]
})

export class SkyRadioDemoModule {
}
