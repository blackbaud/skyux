import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyColorpickerModule } from '@skyux/colorpicker';

import { ColorpickerRoutingModule } from './colorpicker-routing.module';
import { ColorpickerSignalFormsComponent } from './colorpicker-signal-forms.component';
import { ColorpickerComponent } from './colorpicker.component';

@NgModule({
  declarations: [ColorpickerComponent],
  imports: [
    ReactiveFormsModule,
    SkyColorpickerModule,
    ColorpickerRoutingModule,
    ColorpickerSignalFormsComponent,
  ],
})
export class ColorpickerModule {
  public static routes = ColorpickerRoutingModule.routes;
}
