import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyDropdownModule } from '@skyux/popovers';

import { DropdownDemoComponent } from './dropdown-demo.component';

@NgModule({
  imports: [CommonModule, SkyDropdownModule],
  exports: [DropdownDemoComponent],
  declarations: [DropdownDemoComponent],
})
export class DropdownDemoModule {}
