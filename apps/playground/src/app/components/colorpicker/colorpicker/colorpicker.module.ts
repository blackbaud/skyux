import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyColorpickerModule } from '@skyux/colorpicker';
import { SkyIdModule } from '@skyux/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { ColorpickerRoutingModule } from './colorpicker-routing.module';
import { ColorpickerComponent } from './colorpicker.component';

@NgModule({
  declarations: [ColorpickerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyColorpickerModule,
    SkyIdModule,
    ColorpickerRoutingModule,
    SkyStatusIndicatorModule,
  ],
})
export class ColorpickerModule {
  public static routes = ColorpickerRoutingModule.routes;
}
