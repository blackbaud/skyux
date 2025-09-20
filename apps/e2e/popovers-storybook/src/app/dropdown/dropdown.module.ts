import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';
import { SkyDropdownModule } from '@skyux/popovers';

import { DropdownComponent } from './dropdown.component';

const routes: Routes = [{ path: '', component: DropdownComponent }];
@NgModule({
  declarations: [DropdownComponent],
  imports: [
    SkyIconModule,
    SkyDropdownModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [DropdownComponent],
})
export class DropdownModule {}
