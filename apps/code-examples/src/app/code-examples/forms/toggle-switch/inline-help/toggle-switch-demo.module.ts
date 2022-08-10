import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyToggleSwitchModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';

import { ToggleSwitchDemoComponent } from './toggle-switch-demo.component';

@NgModule({
  imports: [CommonModule, SkyHelpInlineModule, SkyToggleSwitchModule],
  declarations: [ToggleSwitchDemoComponent],
  exports: [ToggleSwitchDemoComponent],
})
export class SkyToggleSwitchDemoModule {}
