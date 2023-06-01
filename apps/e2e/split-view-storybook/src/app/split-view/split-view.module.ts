import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkySplitViewModule } from '@skyux/split-view';

import { SplitViewDockFillComponent } from './split-view.component';

const routes: Routes = [{ path: '', component: SplitViewDockFillComponent }];
@NgModule({
  declarations: [SplitViewDockFillComponent],
  imports: [RouterModule.forChild(routes), SkySplitViewModule, CommonModule],
  exports: [SplitViewDockFillComponent],
})
export class SplitViewModule {}
