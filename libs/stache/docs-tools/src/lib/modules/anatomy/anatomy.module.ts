import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyImageModule } from '@blackbaud/skyux-lib-media';

import { SkyFluidGridModule } from '@skyux/layout';

import { SkyDocsAnatomyComponent } from './anatomy.component';

import { SkyDocsAnatomyItemComponent } from './anatomy-item.component';

@NgModule({
  imports: [CommonModule, SkyFluidGridModule, SkyImageModule],
  declarations: [SkyDocsAnatomyComponent, SkyDocsAnatomyItemComponent],
  exports: [SkyDocsAnatomyComponent, SkyDocsAnatomyItemComponent],
})
export class SkyDocsAnatomyModule {}
