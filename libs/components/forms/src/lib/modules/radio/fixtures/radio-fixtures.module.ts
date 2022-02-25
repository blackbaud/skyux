import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkyRadioModule } from '../radio.module';

import { SkyRadioTestComponent } from './radio.component.fixture';

import { SkyRadioGroupBooleanTestComponent } from './radio-group-boolean.component.fixture';

import { SkyRadioGroupReactiveFixtureComponent } from './radio-group-reactive.component.fixture';

import { SkyRadioOnPushTestComponent } from './radio-on-push.component.fixture';

import { SkyRadioGroupFixtureComponent } from './radio-group.component.fixture';

import { SkySingleRadioComponent } from './radio-single.component.fixture';

@NgModule({
  declarations: [
    SkyRadioGroupBooleanTestComponent,
    SkyRadioGroupFixtureComponent,
    SkyRadioGroupReactiveFixtureComponent,
    SkyRadioOnPushTestComponent,
    SkyRadioTestComponent,
    SkySingleRadioComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkyRadioModule],
  exports: [
    SkyRadioGroupBooleanTestComponent,
    SkyRadioGroupFixtureComponent,
    SkyRadioGroupReactiveFixtureComponent,
    SkyRadioTestComponent,
    SkySingleRadioComponent,
  ],
})
export class SkyRadioFixturesModule {}
