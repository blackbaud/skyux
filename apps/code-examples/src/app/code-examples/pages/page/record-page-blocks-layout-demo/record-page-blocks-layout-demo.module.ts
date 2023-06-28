import { NgModule } from '@angular/core';
import { SkyPageModule } from '@skyux/pages';

import { RecordPageBlocksLayoutDemoComponent } from './record-page-blocks-layout-demo.component';

@NgModule({
  declarations: [RecordPageBlocksLayoutDemoComponent],
  exports: [RecordPageBlocksLayoutDemoComponent],
  imports: [SkyPageModule],
})
export class RecordPageBlocksLayoutDemoModule {}
