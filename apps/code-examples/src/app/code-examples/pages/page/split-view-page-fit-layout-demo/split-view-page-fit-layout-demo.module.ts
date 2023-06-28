import { NgModule } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { SplitViewPageFitLayoutDemoComponent } from './split-view-page-fit-layout-demo.component';

@NgModule({
  declarations: [SplitViewPageFitLayoutDemoComponent],
  exports: [SplitViewPageFitLayoutDemoComponent],
  imports: [SkyPageModule],
})
export class SplitViewPageFitLayoutDemoModule {}
