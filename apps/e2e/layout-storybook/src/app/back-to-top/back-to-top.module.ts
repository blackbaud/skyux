import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyBackToTopModule } from '@skyux/layout';

import { BackToTopComponent } from './back-to-top.component';

const routes: Routes = [{ path: '', component: BackToTopComponent }];
@NgModule({
  declarations: [BackToTopComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyBackToTopModule],
  exports: [BackToTopComponent],
})
export class BackToTopModule {}
