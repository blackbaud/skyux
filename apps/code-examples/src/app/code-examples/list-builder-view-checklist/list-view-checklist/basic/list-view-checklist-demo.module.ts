import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SkyRadioModule } from '@skyux/forms';

import { SkyListModule, SkyListToolbarModule } from '@skyux/list-builder';

import { SkyListViewChecklistModule } from 'projects/list-builder-view-checklist/src/public-api';

import { ListViewChecklistDemoComponent } from './list-view-checklist-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewChecklistModule,
    SkyRadioModule,
  ],
  declarations: [ListViewChecklistDemoComponent],
  exports: [ListViewChecklistDemoComponent],
})
export class ListViewChecklistDemoModule {}
