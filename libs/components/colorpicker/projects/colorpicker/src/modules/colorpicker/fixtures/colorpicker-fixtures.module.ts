import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkyInputBoxModule } from '@skyux/forms';

import { SkyColorpickerModule } from '../colorpicker.module';

import { ColorpickerReactiveTestComponent } from './colorpicker-reactive-component.fixture';

import { ColorpickerTestComponent } from './colorpicker-component.fixture';

@NgModule({
  declarations: [ColorpickerReactiveTestComponent, ColorpickerTestComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyColorpickerModule,
    SkyInputBoxModule,
  ],
})
export class SkyColorpickerFixturesModule {}
