import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyFluidGridModule } from '@skyux/layout';

import { CheckboxComponent } from './checkbox.component';

const routes: Routes = [{ path: '', component: CheckboxComponent }];

@NgModule({
  declarations: [CheckboxComponent],
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyFluidGridModule,
    SkyHelpInlineModule,
    RouterModule.forChild(routes),
  ],
  exports: [CheckboxComponent],
})
export class CheckboxModule {}
