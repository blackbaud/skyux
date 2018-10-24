import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyListModule,
  SkyListFiltersModule,
  SkyListPagingModule,
  SkyListToolbarModule
} from '@skyux/list-builder';

import {
  SkyListViewChecklistModule
} from '@skyux/list-builder-view-checklist';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule,
  SkyTokensModule
} from '@skyux/indicators';

import {
  SkySelectFieldResourcesModule
} from '../../plugin-resources/select-field-resources.module';

import {
  SkySelectFieldComponent
} from './select-field.component';

import {
  SkySelectFieldPickerComponent
} from './select-field-picker.component';

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
    SkyIconModule
  ],
  exports: [
    SkySelectFieldComponent,
    SkySelectFieldPickerComponent
  ],
  declarations: [
    SkySelectFieldComponent,
    SkySelectFieldPickerComponent
  ],
  entryComponents: [
    SkySelectFieldPickerComponent
  ]
})
export class SkySelectFieldModule { }
