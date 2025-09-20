import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyRadioModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { RadioRoutingModule } from './radio-routing.module';
import { RadioComponent } from './radio.component';

@NgModule({
  declarations: [RadioComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyHelpInlineModule,
    SkyRadioModule,
    RadioRoutingModule,
  ],
})
export class RadioModule {
  public static routes = RadioRoutingModule.routes;
}
