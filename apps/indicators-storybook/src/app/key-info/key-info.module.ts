import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { KeyInfoComponent } from './key-info.component';

const routes: Routes = [{ path: '', component: KeyInfoComponent }];
@NgModule({
  declarations: [KeyInfoComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyKeyInfoModule],
  exports: [KeyInfoComponent],
})
export class KeyInfoModule {}
