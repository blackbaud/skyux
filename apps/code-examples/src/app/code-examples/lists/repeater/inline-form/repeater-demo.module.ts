import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';
import { SkyInlineFormModule } from '@skyux/inline-form';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyThemeModule } from '@skyux/theme';

import { RepeaterDemoComponent } from './repeater-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyIconModule,
    SkyIdModule,
    SkyInlineFormModule,
    SkyInputBoxModule,
    SkyRepeaterModule,
    SkyThemeModule,
  ],
  exports: [RepeaterDemoComponent],
  declarations: [RepeaterDemoComponent],
})
export class RepeaterDemoModule {}
