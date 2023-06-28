import { NgModule } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { ListPageTabsLayoutDemoComponent } from './list-page-tabs-layout-demo.component';

@NgModule({
  declarations: [ListPageTabsLayoutDemoComponent],
  exports: [ListPageTabsLayoutDemoComponent],
  imports: [SkyPageModule],
})
export class ListPageTabsLayoutDemoModule {}
