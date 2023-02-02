import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/indicators';
import { SkyInlineDeleteModule } from '@skyux/layout';

import { InlineDeleteDemoComponent } from './inline-delete-demo.component';

@NgModule({
  imports: [CommonModule, SkyIconModule, SkyInlineDeleteModule],
  declarations: [InlineDeleteDemoComponent],
  exports: [InlineDeleteDemoComponent],
})
export class InlineDeleteDemoModule {}
