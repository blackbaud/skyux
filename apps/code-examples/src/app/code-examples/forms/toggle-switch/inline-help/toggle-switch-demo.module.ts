import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyToggleSwitchModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';

import { ToggleSwitchDemoComponent } from './toggle-switch-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyHelpInlineModule,
    SkyToggleSwitchModule,
    ReactiveFormsModule,
  ],
  declarations: [ToggleSwitchDemoComponent],
  exports: [ToggleSwitchDemoComponent],
})
export class SkyToggleSwitchDemoModule {}
