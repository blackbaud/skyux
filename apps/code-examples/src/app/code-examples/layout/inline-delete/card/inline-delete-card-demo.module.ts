import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyCardModule, SkyInlineDeleteModule } from '@skyux/layout';

import { InlineDeleteCardDemoComponent } from './inline-delete-card-demo.component';

@NgModule({
  imports: [CommonModule, SkyCardModule, SkyInlineDeleteModule],
  declarations: [InlineDeleteCardDemoComponent],
  exports: [InlineDeleteCardDemoComponent],
})
export class InlineDeleteCardDemoModule {}
