import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyFlyoutModule } from '@skyux/flyout';

import { FlyoutStandardComponent } from './flyout-standard.component';
import { FlyoutComponent } from './flyout.component';

const routes: Routes = [{ path: '', component: FlyoutComponent }];
@NgModule({
  declarations: [FlyoutComponent, FlyoutStandardComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyFlyoutModule],
  exports: [FlyoutComponent],
})
export class FlyoutModule {}
