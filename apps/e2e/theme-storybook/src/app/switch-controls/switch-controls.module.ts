import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';

import { SwitchControlsComponent } from './switch-controls.component';

const routes: Routes = [{ path: '', component: SwitchControlsComponent }];
@NgModule({
  declarations: [SwitchControlsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyRadioModule,
    SkyCheckboxModule,
    ReactiveFormsModule,
  ],
  exports: [SwitchControlsComponent],
})
export class SwitchControlsModule {}
