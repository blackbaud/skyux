import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyAlertModule } from '@skyux/indicators';

import { AlertComponent } from './alert.component';

const routes: Routes = [{ path: '', component: AlertComponent }];
@NgModule({
  declarations: [AlertComponent],
  exports: [AlertComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyAlertModule],
})
export class AlertModule {}
