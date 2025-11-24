import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyFilterBarModule } from '@skyux/filter-bar';
import { SkyRadioModule } from '@skyux/forms';
import { SkyListSummaryModule } from '@skyux/lists';

import { DataManagerWithListToolbarsComponent } from './data-manager-with-list-toolbars.component';

const routes: Routes = [
  { path: '', component: DataManagerWithListToolbarsComponent },
];
@NgModule({
  declarations: [DataManagerWithListToolbarsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyDataManagerModule,
    SkyFilterBarModule,
    SkyListSummaryModule,
    SkyRadioModule,
  ],
  exports: [DataManagerWithListToolbarsComponent],
})
export class DataManagerWithListToolbarsModule {}
