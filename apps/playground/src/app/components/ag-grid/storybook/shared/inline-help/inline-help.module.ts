import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { InlineHelpComponent } from './inline-help.component';

@NgModule({
  declarations: [InlineHelpComponent],
  exports: [InlineHelpComponent],
  imports: [CommonModule, SkyHelpInlineModule],
})
export class InlineHelpModule {}
