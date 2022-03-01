import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyToggleSwitchLabelComponent } from './toggle-switch-label.component';
import { SkyToggleSwitchComponent } from './toggle-switch.component';

@NgModule({
  declarations: [SkyToggleSwitchLabelComponent, SkyToggleSwitchComponent],
  imports: [CommonModule, FormsModule],
  exports: [SkyToggleSwitchLabelComponent, SkyToggleSwitchComponent],
})
export class SkyToggleSwitchModule {}
