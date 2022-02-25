import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyRepeaterModule } from '@skyux/lists';

import { SkyDropdownModule } from '@skyux/popovers';

import { RepeaterDemoComponent } from './repeater-demo.component';

@NgModule({
  imports: [CommonModule, SkyDropdownModule, SkyRepeaterModule],
  declarations: [RepeaterDemoComponent],
  exports: [RepeaterDemoComponent],
})
export class RepeaterDemoModule {}
