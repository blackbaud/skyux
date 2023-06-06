import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlyoutComponent } from './flyout.component';

const routes: Routes = [{ path: '', component: FlyoutComponent }];
@NgModule({
  declarations: [FlyoutComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [FlyoutComponent],
})
export class FlyoutModule {}
