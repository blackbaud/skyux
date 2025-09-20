import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyFluidGridModule } from '@skyux/layout';

import { CheckboxComponent } from './checkbox.component';

const routes: Routes = [{ path: '', component: CheckboxComponent }];

@NgModule({
  declarations: [CheckboxComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyFluidGridModule,
    SkyHelpInlineModule,
    RouterModule.forChild(routes),
  ],
  exports: [CheckboxComponent],
})
export class CheckboxModule {}
