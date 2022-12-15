import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyDockModule } from '@skyux/core';

import { DockComponent } from './dock.component';

const routes: Routes = [{ path: '', component: DockComponent }];
@NgModule({
  declarations: [DockComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyDockModule],
  exports: [DockComponent],
})
export class DockModule {}
