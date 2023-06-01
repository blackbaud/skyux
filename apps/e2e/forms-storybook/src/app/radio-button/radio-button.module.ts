import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyRadioModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyFluidGridModule } from '@skyux/layout';

import { RadioButtonComponent } from './radio-button.component';

const routes: Routes = [{ path: '', component: RadioButtonComponent }];

@NgModule({
  declarations: [RadioButtonComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyRadioModule,
    SkyFluidGridModule,
    SkyHelpInlineModule,
    RouterModule.forChild(routes),
  ],
  exports: [RadioButtonComponent],
})
export class RadioButtonModule {}
