import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyIdModule } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { SkyCharacterCounterModule } from '../../character-counter/character-counter.module';
import { SkyInputBoxModule } from '../input-box.module';

import { InputBoxHostServiceFixtureComponent } from './input-box-host-service.component.fixture';
import { InputBoxFixtureComponent } from './input-box.component.fixture';

@NgModule({
  imports: [
    NoopAnimationsModule,
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
