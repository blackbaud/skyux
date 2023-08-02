import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from '@blackbaud/angular-tree-component';
import { SkyAngularTreeModule } from '@skyux/angular-tree-component';
import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

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
    SkyHelpInlineModule,
  ],
  declarations: [AngularTreeDemoComponent],
  exports: [AngularTreeDemoComponent],
})
export class AngularTreeDemoModule {}
