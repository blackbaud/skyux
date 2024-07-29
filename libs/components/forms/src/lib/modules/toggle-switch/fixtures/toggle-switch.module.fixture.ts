import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyToggleSwitchModule } from '../toggle-switch.module';

import { SkyToggleSwitchChangeEventFixtureComponent } from './toggle-switch-change-event.component.fixture';
import { SkyToggleSwitchFormDirectivesFixtureComponent } from './toggle-switch-form-directives.component.fixture';
import { SkyToggleSwitchOnPushFixtureComponent } from './toggle-switch-on-push.component.fixture';
import { SkyToggleSwitchReactiveFormFixtureComponent } from './toggle-switch-reactive-form.component.fixture';
import { SkyToggleSwitchFixtureComponent } from './toggle-switch.component.fixture';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyHelpInlineModule,
    SkyToggleSwitchModule,
  ],
  declarations: [
    SkyToggleSwitchChangeEventFixtureComponent,
    SkyToggleSwitchFormDirectivesFixtureComponent,
    SkyToggleSwitchOnPushFixtureComponent,
    SkyToggleSwitchReactiveFormFixtureComponent,
    SkyToggleSwitchFixtureComponent,
  ],
  exports: [
    SkyToggleSwitchChangeEventFixtureComponent,
    SkyToggleSwitchFormDirectivesFixtureComponent,
    SkyToggleSwitchOnPushFixtureComponent,
    SkyToggleSwitchReactiveFormFixtureComponent,
    SkyToggleSwitchFixtureComponent,
  ],
})
export class SkyToggleSwitchFixturesModule {}
