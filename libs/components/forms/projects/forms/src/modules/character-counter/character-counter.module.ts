import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  NgModule
} from '@angular/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyFormsResourcesModule
} from '../shared/sky-forms-resources.module';

import {
  SkyCharacterCounterInputDirective
} from './character-counter.directive';

import {
  SkyCharacterCounterIndicatorComponent
} from './character-counter-indicator.component';

@NgModule({
  declarations: [
    SkyCharacterCounterInputDirective,
    SkyCharacterCounterIndicatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyFormsResourcesModule,
    SkyI18nModule
  ],
  exports: [
    SkyCharacterCounterInputDirective,
    SkyCharacterCounterIndicatorComponent
  ]
})
export class SkyCharacterCounterModule { }
