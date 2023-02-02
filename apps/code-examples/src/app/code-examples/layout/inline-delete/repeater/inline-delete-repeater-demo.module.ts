import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyInlineDeleteModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';

import { InlineDeleteRepeaterDemoComponent } from './inline-delete-repeater-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyInlineDeleteModule,
    SkyRepeaterModule,
  ],
  declarations: [InlineDeleteRepeaterDemoComponent],
  exports: [InlineDeleteRepeaterDemoComponent],
})
export class InlineDeleteRepeaterDemoModule {}
