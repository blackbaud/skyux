import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import {
  SkyCharacterCounterModule,
  SkyFormErrorsModule,
  SkyInputBoxModule,
} from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { InputBoxRoutingModule } from './input-box-routing.module';
import { InputBoxVisualHostComponent } from './input-box-visual-host.component';
import { InputBoxComponent } from './input-box.component';

@NgModule({
  declarations: [InputBoxComponent, InputBoxVisualHostComponent],
  imports: [
    FormsModule,
    InputBoxRoutingModule,
    ReactiveFormsModule,
    SkyCharacterCounterModule,
    SkyFormErrorsModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
  ],
})
export class InputBoxModule {
  public static routes = InputBoxRoutingModule.routes;
}
