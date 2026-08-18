import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule, SkyTrimModule } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyToggleSwitchComponent } from './toggle-switch.component';

@NgModule({
  declarations: [SkyToggleSwitchComponent],
  imports: [
    CommonModule,
    FormsModule,
    SkyHelpInlineModule,
    SkyIdModule,
    SkyTrimModule,
  ],
  exports: [SkyToggleSwitchComponent],
})
export class SkyToggleSwitchModule {}
