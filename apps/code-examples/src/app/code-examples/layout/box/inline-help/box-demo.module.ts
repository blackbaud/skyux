import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyBoxModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

import { BoxDemoComponent } from './box-demo.component';

@NgModule({
  imports: [CommonModule, SkyBoxModule, SkyDropdownModule, SkyHelpInlineModule],
  declarations: [BoxDemoComponent],
  exports: [BoxDemoComponent],
})
export class BoxDemoModule {}
