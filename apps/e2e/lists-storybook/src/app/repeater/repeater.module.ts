import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyButton } from '@skyux/forms';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

import { RepeaterComponent } from './repeater.component';

const routes: Routes = [{ path: '', component: RepeaterComponent }];
@NgModule({
  declarations: [RepeaterComponent],
  imports: [
    SkyButton,
    CommonModule,
    RouterModule.forChild(routes),
    SkyRepeaterModule,
    SkyDropdownModule,
    SkyThemeModule,
  ],
  exports: [RepeaterComponent],
})
export class RepeaterModule {}
