import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from 'ag-grid-angular';

import { InlineHelpModule } from '../shared/inline-help/inline-help.module';

import { DataManagerComponent } from './data-manager.component';

const routes: Routes = [{ path: '', component: DataManagerComponent }];
@NgModule({
  declarations: [DataManagerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyAgGridModule,
    SkyCheckboxModule,
    SkyDataManagerModule,
    SkyRadioModule,
    ReactiveFormsModule,
    AgGridModule,
    InlineHelpModule,
    SkyDropdownModule,
  ],
  exports: [DataManagerComponent],
})
export class DataManagerModule {}
