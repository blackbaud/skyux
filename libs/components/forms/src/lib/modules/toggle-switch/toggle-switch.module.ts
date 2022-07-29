import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';

import { SkyToggleSwitchLabelComponent } from './toggle-switch-label.component';
import { SkyToggleSwitchComponent } from './toggle-switch.component';

@NgModule({
  declarations: [SkyToggleSwitchLabelComponent, SkyToggleSwitchComponent],
  imports: [CommonModule, FormsModule, SkyIdModule],
  exports: [SkyToggleSwitchLabelComponent, SkyToggleSwitchComponent],
})
export class SkyToggleSwitchModule {}
