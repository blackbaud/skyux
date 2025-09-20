import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyIdModule } from '@skyux/core';
import {
  SkyCheckboxModule,
  SkyRadioModule,
  SkySelectionBoxModule,
} from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';

import { SelectionBoxComponent } from './selection-box.component';

const routes: Routes = [{ path: '', component: SelectionBoxComponent }];
@NgModule({
  declarations: [SelectionBoxComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SkyCheckboxModule,
    SkyIconModule,
    SkyIdModule,
    SkyRadioModule,
    SkySelectionBoxModule,
  ],
  exports: [SelectionBoxComponent],
})
export class SelectionBoxModule {}
