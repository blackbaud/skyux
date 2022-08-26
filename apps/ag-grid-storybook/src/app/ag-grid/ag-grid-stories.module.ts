import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyAgGridModule } from '@skyux/ag-grid';

import { AgGridModule } from 'ag-grid-angular';

import { AgGridStoriesComponent } from './ag-grid-stories.component';

const routes: Routes = [{ path: '', component: AgGridStoriesComponent }];
@NgModule({
  declarations: [AgGridStoriesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyAgGridModule,
    AgGridModule,
  ],
  exports: [AgGridStoriesComponent],
})
export class AgGridStoriesModule {}
