import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyToggleSwitchModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { ToggleSwitchComponent } from './toggle-switch.component';

const routes: Routes = [{ path: '', component: ToggleSwitchComponent }];
@NgModule({
  declarations: [ToggleSwitchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyToggleSwitchModule,
    SkyHelpInlineModule,
  ],
  exports: [ToggleSwitchComponent],
})
export class ToggleSwitchModule {}
