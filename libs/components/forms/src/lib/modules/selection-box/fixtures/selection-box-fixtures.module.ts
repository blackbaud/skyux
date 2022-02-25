import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

import { SkyIdModule } from '@skyux/core';

import { SkyIconModule } from '@skyux/indicators';

import { SkyCheckboxModule } from '../../checkbox/checkbox.module';

import { SkyRadioModule } from '../../radio/radio.module';

import { SkySelectionBoxModule } from '../selection-box.module';

import { SelectionBoxGridTestComponent } from './selection-box-grid.component.fixture';

import { SelectionBoxTestComponent } from './selection-box.component.fixture';

@NgModule({
  declarations: [SelectionBoxTestComponent, SelectionBoxGridTestComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyIdModule,
    SkyRadioModule,
    SkySelectionBoxModule,
  ],
})
export class SkySelectionBoxFixturesModule {}
