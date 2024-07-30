import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyRadioModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { RadioButtonComponent } from './radio-button.component';

const routes: Routes = [{ path: '', component: RadioButtonComponent }];

@NgModule({
  declarations: [RadioButtonComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyRadioModule,
    SkyHelpInlineModule,
    RouterModule.forChild(routes),
  ],
  exports: [RadioButtonComponent],
})
export class RadioButtonModule {}
