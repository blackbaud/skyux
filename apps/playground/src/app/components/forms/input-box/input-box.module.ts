import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCharacterCounterModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyHelpInlineModule, SkyIconModule } from '@skyux/indicators';

import { InputBoxRoutingModule } from './input-box-routing.module';
import { InputBoxVisualHostComponent } from './input-box-visual-host.component';
import { InputBoxComponent } from './input-box.component';

@NgModule({
  declarations: [InputBoxComponent, InputBoxVisualHostComponent],
  imports: [
    CommonModule,
    FormsModule,
    InputBoxRoutingModule,
    ReactiveFormsModule,
    SkyCharacterCounterModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyIdModule,
    SkyInputBoxModule,
  ],
})
export class InputBoxModule {}
