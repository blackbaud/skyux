import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkySplitViewModule } from '@skyux/split-view';

import { SplitViewComponent } from './split-view.component';

const routes: Routes = [{ path: '', component: SplitViewComponent }];
@NgModule({
  declarations: [SplitViewComponent],
  imports: [RouterModule.forChild(routes), SkySplitViewModule, CommonModule],
  exports: [SplitViewComponent],
})
export class SplitViewModule {}
