import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyHelpTestingModule } from '@skyux/core/testing';
import { SkyInputBoxModule } from '@skyux/forms';

import { SkyColorpickerModule } from '../colorpicker.module';

import { ColorpickerTestComponent } from './colorpicker-component.fixture';
import { ColorpickerReactiveTestComponent } from './colorpicker-reactive-component.fixture';

@NgModule({
  declarations: [ColorpickerReactiveTestComponent, ColorpickerTestComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyColorpickerModule,
    SkyHelpTestingModule,
    SkyInputBoxModule],
})
export class SkyColorpickerFixturesModule {}
