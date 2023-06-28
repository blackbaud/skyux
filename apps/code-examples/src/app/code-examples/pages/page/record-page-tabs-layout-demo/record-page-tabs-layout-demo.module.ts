import { NgModule } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { RecordPageTabsLayoutDemoComponent } from './record-page-tabs-layout-demo.component';

@NgModule({
  declarations: [RecordPageTabsLayoutDemoComponent],
  exports: [RecordPageTabsLayoutDemoComponent],
  imports: [SkyPageModule],
})
export class RecordPageTabsLayoutDemoModule {}
