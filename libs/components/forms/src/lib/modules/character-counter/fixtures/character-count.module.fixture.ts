import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkyCharacterCounterModule } from '../character-counter.module';

import { CharacterCountNoIndicatorTestComponent } from './character-count-no-indicator.component.fixture';
import { CharacterCountTestComponent } from './character-count.component.fixture';

@NgModule({
  declarations: [
    CharacterCountNoIndicatorTestComponent,
    CharacterCountTestComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyCharacterCounterModule,
    ReactiveFormsModule,
  ],
  exports: [
    CharacterCountNoIndicatorTestComponent,
    CharacterCountTestComponent,
  ],
})
export class CharacterCountTestModule {}
