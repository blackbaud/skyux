import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SkyColorpickerModule } from 'projects/colorpicker/src/public-api';

import { ColorpickerDemoComponent } from './colorpicker-demo.component';

@NgModule({
  imports: [CommonModule, FormsModule, SkyColorpickerModule],
  declarations: [ColorpickerDemoComponent],
  exports: [ColorpickerDemoComponent],
})
export class ColorpickerDemoModule {}
