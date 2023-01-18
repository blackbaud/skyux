import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyDockModule } from '@skyux/core';

import { DockItemVisualComponent } from './dock-item-visual.component';
import { DockComponent } from './dock.component';

const routes: Routes = [{ path: '', component: DockComponent }];
@NgModule({
  declarations: [DockComponent, DockItemVisualComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SkyDockModule,
  ],
  exports: [DockComponent],
})
export class DockModule {}
