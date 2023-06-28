import { NgModule } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { ListPageListLayoutDemoComponent } from './list-page-list-layout-demo.component';

@NgModule({
  declarations: [ListPageListLayoutDemoComponent],
  exports: [ListPageListLayoutDemoComponent],
  imports: [SkyPageModule],
})
export class ListPageListLayoutDemoModule {}
