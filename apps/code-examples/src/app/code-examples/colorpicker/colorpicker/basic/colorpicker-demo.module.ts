import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyColorpickerModule } from '@skyux/colorpicker';
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
