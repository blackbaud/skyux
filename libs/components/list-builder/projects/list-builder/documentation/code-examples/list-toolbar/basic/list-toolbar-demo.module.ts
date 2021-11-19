import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkyRadioModule } from '@skyux/forms';

import { SkyIconModule } from '@skyux/indicators';

import {
  SkyListFiltersModule,
  SkyListModule,
  SkyListSecondaryActionsModule,
  SkyListToolbarModule,
} from 'projects/list-builder/src/public-api';

import { SkyFilterModule } from '@skyux/lists';

import { SkyDropdownModule } from '@skyux/popovers';

import { ListToolbarDemoComponent } from './list-toolbar-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyDropdownModule,
    SkyFilterModule,
    SkyIconModule,
    SkyListFiltersModule,
    SkyListModule,
    SkyListSecondaryActionsModule,
    SkyListToolbarModule,
    SkyRadioModule,
    ReactiveFormsModule,
  ],
  declarations: [ListToolbarDemoComponent],
  exports: [ListToolbarDemoComponent],
})
export class ListToolbarDemoModule {}
