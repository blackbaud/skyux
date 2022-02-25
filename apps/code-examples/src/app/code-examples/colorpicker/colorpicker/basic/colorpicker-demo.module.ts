import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { SkyColorpickerModule } from 'projects/colorpicker/src/public-api';

import { SkyIdModule } from '@skyux/core';

import { ColorpickerDemoComponent } from './colorpicker-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyColorpickerModule,
    SkyIdModule,
  ],
  declarations: [ColorpickerDemoComponent],
  exports: [ColorpickerDemoComponent],
})
export class ColorpickerDemoModule {}
