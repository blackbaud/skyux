import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

import { RepeaterComponent } from './repeater.component';

const routes: Routes = [{ path: '', component: RepeaterComponent }];
@NgModule({
  declarations: [RepeaterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyRepeaterModule,
    SkyDropdownModule,
    SkyIconModule,
    SkyThemeModule,
  ],
  exports: [RepeaterComponent],
})
export class RepeaterModule {}
