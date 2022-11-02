import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyToggleSwitchModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';

import { ToggleSwitchDemoComponent } from './toggle-switch-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyHelpInlineModule,
    SkyToggleSwitchModule,
    FormsModule,
  ],
  declarations: [ToggleSwitchDemoComponent],
  exports: [ToggleSwitchDemoComponent],
})
export class SkyToggleSwitchDemoModule {}
