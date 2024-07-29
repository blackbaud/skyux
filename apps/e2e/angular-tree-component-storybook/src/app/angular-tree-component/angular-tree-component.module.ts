import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeModule } from '@blackbaud/angular-tree-component';
import { SkyAngularTreeModule } from '@skyux/angular-tree-component';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyDropdownModule } from '@skyux/popovers';

import { AngularTreeComponentComponent } from './angular-tree-component.component';

const routes: Routes = [{ path: '', component: AngularTreeComponentComponent }];
@NgModule({
  declarations: [AngularTreeComponentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyAngularTreeModule,
    SkyHelpInlineModule,
    SkyDropdownModule,
    TreeModule,
  ],
  exports: [AngularTreeComponentComponent],
})
export class AngularTreeComponentModule {}
