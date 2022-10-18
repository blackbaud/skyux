import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { SkySplitViewModule } from '@skyux/split-view';

import { SplitViewDockFillComponent } from './split-view.component';

const routes: Routes = [{ path: '', component: SplitViewDockFillComponent }];
@NgModule({
  declarations: [SplitViewDockFillComponent],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forChild(routes),
    SkySplitViewModule,
  ],
  exports: [SplitViewDockFillComponent],
})
export class SplitViewModule {}
