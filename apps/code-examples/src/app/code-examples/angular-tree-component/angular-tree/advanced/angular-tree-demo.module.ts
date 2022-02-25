import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

import { SkyAngularTreeModule } from '@skyux/angular-tree-component';

import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';

import { SkyFluidGridModule } from '@skyux/layout';

import { SkyDropdownModule } from '@skyux/popovers';

import { TreeModule } from '@circlon/angular-tree-component';

import { AngularTreeDemoComponent } from './angular-tree-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyAngularTreeModule,
    SkyCheckboxModule,
    SkyDropdownModule,
    SkyFluidGridModule,
    SkyRadioModule,
    TreeModule,
  ],
  declarations: [AngularTreeDemoComponent],
  exports: [AngularTreeDemoComponent],
})
export class AngularTreeDemoModule {}
