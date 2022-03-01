import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule, SkyTokensModule } from '@skyux/indicators';
import {
  SkyListFiltersModule,
  SkyListModule,
  SkyListPagingModule,
  SkyListToolbarModule,
} from '@skyux/list-builder';
import { SkyListViewChecklistModule } from '@skyux/list-builder-view-checklist';
import { SkyModalModule } from '@skyux/modals';

import { SkySelectFieldResourcesModule } from '../shared/sky-select-field-resources.module';

import { SkySelectFieldPickerComponent } from './select-field-picker.component';
import { SkySelectFieldComponent } from './select-field.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkySelectFieldResourcesModule,
    SkyI18nModule,
    SkyListFiltersModule,
    SkyListModule,
    SkyListPagingModule,
    SkyListToolbarModule,
    SkyListViewChecklistModule,
    SkyModalModule,
    SkyTokensModule,
    SkyIconModule,
  ],
  exports: [SkySelectFieldComponent],
  declarations: [SkySelectFieldComponent, SkySelectFieldPickerComponent],
  entryComponents: [SkySelectFieldPickerComponent],
})
export class SkySelectFieldModule {}
