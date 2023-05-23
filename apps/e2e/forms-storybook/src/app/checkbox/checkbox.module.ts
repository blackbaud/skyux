import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyFluidGridModule } from '@skyux/layout';

import { CheckboxComponent } from './checkbox.component';

const routes: Routes = [{ path: '', component: CheckboxComponent }];

@NgModule({
  declarations: [CheckboxComponent],
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyFluidGridModule,
    RouterModule.forChild(routes),
  ],
  exports: [CheckboxComponent],
})
export class CheckboxModule {}
