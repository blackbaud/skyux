import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyDropdownModule, SkyPopoverModule } from '@skyux/popovers';

import { PopoverComponent } from './popover.component';

const routes: Routes = [{ path: '', component: PopoverComponent }];
@NgModule({
  declarations: [PopoverComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SkyDropdownModule,
    SkyPopoverModule,
  ],
  exports: [PopoverComponent],
})
export class PopoverModule {}
