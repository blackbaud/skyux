import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyColorpickerModule } from '@skyux/colorpicker';

import { ColorpickerRoutingModule } from './colorpicker-routing.module';
import { ColorpickerComponent } from './colorpicker.component';

@NgModule({
  declarations: [ColorpickerComponent],
  imports: [
    ReactiveFormsModule,
    SkyColorpickerModule,
    ColorpickerRoutingModule,
    CommonModule,
  ],
})
export class ColorpickerModule {
  public static routes = ColorpickerRoutingModule.routes;
}
