import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyToggleSwitchModule } from '@skyux/forms';

import { ToggleSwitchDemoComponent } from './toggle-switch-demo.component';

@NgModule({
  imports: [CommonModule, SkyToggleSwitchModule],
  declarations: [ToggleSwitchDemoComponent],
  exports: [ToggleSwitchDemoComponent],
})
export class SkyToggleSwitchDemoModule {}
