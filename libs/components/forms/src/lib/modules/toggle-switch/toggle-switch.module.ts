import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule, SkyTrimModule } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyToggleSwitchLabelComponent } from './toggle-switch-label.component';
import { SkyToggleSwitchComponent } from './toggle-switch.component';

@NgModule({
  declarations: [SkyToggleSwitchLabelComponent, SkyToggleSwitchComponent],
  imports: [
    CommonModule,
    FormsModule,
    SkyHelpInlineModule,
    SkyIdModule,
    SkyTrimModule,
  ],
  exports: [SkyToggleSwitchLabelComponent, SkyToggleSwitchComponent],
})
export class SkyToggleSwitchModule {}
