import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyAgGridModule } from '@skyux/ag-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
} from '@skyux/data-manager';
import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';

import { AgGridModule } from 'ag-grid-angular';

import { FontLoadingModule } from '../shared/font-loading/font-loading.module';
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
    FontLoadingModule,
  ],
  exports: [DataManagerComponent],
  providers: [SkyDataManagerService],
})
export class DataManagerModule {}
