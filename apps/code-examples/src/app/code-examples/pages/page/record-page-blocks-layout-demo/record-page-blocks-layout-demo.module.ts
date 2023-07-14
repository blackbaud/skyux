import { CommonModule } from '@angular/common';
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
    CommonModule,
    SkyBoxModule,
    SkyDescriptionListModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyPageModule,
    SkyRepeaterModule,
  ],
})
export class RecordPageBlocksLayoutDemoModule {}
