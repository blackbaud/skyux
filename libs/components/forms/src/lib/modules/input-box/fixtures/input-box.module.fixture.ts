import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import {
  SkyHelpInlineModule,
  SkyIconModule,
  SkyStatusIndicatorModule,
} from '@skyux/indicators';

import { SkyCharacterCounterModule } from '../../character-counter/character-counter.module';
import { SkyInputBoxModule } from '../input-box.module';

import { InputBoxHostServiceFixtureComponent } from './input-box-host-service.component.fixture';
import { InputBoxFixtureComponent } from './input-box.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCharacterCounterModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
  ],
  exports: [InputBoxFixtureComponent, InputBoxHostServiceFixtureComponent],
  declarations: [InputBoxFixtureComponent, InputBoxHostServiceFixtureComponent],
})
export class InputBoxFixturesModule {}
