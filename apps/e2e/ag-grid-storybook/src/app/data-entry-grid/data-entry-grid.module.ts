import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { PreviewWrapperModule } from '@skyux/storybook';
import { SkyThemeModule } from '@skyux/theme';

import { AgGridModule } from 'ag-grid-angular';

import { InlineHelpModule } from '../shared/inline-help/inline-help.module';

import { DataEntryGridComponent } from './data-entry-grid.component';

const routes: Routes = [{ path: '', component: DataEntryGridComponent }];
@NgModule({
  declarations: [DataEntryGridComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyAgGridModule,
    AgGridModule,
    SkyThemeModule,
    PreviewWrapperModule,
    InlineHelpModule,
  ],
  exports: [DataEntryGridComponent],
})
export class DataEntryGridModule {}
