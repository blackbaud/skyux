import { NgModule } from '@angular/core';
import { SkyIconModule, SkyKeyInfoModule } from '@skyux/indicators';
import {
  SkyBoxModule,
  SkyDescriptionListModule,
  SkyFluidGridModule,
} from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyPageModule } from '@skyux/pages';

import { RecordPageBlocksLayoutDemoComponent } from './record-page-blocks-layout-demo.component';
import { RecordPageContentComponent } from './record-page-content.component';

@NgModule({
  declarations: [
    RecordPageBlocksLayoutDemoComponent,
    RecordPageContentComponent,
  ],
  exports: [RecordPageBlocksLayoutDemoComponent],
  imports: [
    SkyPageModule,
    SkyFluidGridModule,
    SkyBoxModule,
    SkyDescriptionListModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyRepeaterModule,
  ],
})
export class RecordPageBlocksLayoutDemoModule {}
