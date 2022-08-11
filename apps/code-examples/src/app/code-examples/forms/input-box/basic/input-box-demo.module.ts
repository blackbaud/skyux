import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyThemeModule, SkyThemeService } from '@skyux/theme';

import { InputBoxDemoComponent } from './input-box-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyDatepickerModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyThemeModule,
    SkyHelpInlineModule,
  ],
  declarations: [InputBoxDemoComponent],
  exports: [InputBoxDemoComponent],
  providers: [SkyThemeService],
})
export class SkyInputBoxDemoModule {}
