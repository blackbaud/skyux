import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/indicators';

import { SkyCharacterCounterModule } from '../../character-counter/character-counter.module';
import { SkyInputBoxModule } from '../input-box.module';

import { InputBoxHostServiceFixtureComponent } from './input-box-host-service.component.fixture';
import { InputBoxFixtureComponent } from './input-box.component.fixture';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCharacterCounterModule,
    SkyIconModule,
    SkyIdModule,
    SkyInputBoxModule,
  ],
  exports: [InputBoxFixtureComponent, InputBoxHostServiceFixtureComponent],
  declarations: [InputBoxFixtureComponent, InputBoxHostServiceFixtureComponent],
})
export class InputBoxFixturesModule {}
