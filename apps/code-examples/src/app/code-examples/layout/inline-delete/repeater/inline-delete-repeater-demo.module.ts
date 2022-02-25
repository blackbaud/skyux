import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyInlineDeleteModule } from 'projects/layout/src/public-api';

import { SkyRepeaterModule } from '@skyux/lists';

import { SkyDropdownModule } from '@skyux/popovers';

import { InlineDeleteRepeaterDemoComponent } from './inilne-delete-repeater-demo.component';

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
