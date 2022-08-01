import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule, SkyTrimModule } from '@skyux/core';

import { SkyToggleSwitchLabelComponent } from './toggle-switch-label.component';
import { SkyToggleSwitchComponent } from './toggle-switch.component';

@NgModule({
  declarations: [SkyToggleSwitchLabelComponent, SkyToggleSwitchComponent],
  imports: [CommonModule, FormsModule, SkyTrimModule, SkyIdModule],
  exports: [SkyToggleSwitchLabelComponent, SkyToggleSwitchComponent],
})
export class SkyToggleSwitchModule {}
