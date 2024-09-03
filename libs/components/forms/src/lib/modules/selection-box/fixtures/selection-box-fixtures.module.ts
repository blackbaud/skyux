import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';

import { SkyCheckboxModule } from '../../checkbox/checkbox.module';
import { SkyRadioModule } from '../../radio/radio.module';
import { SkySelectionBoxModule } from '../selection-box.module';

import { SelectionBoxGridTestComponent } from './selection-box-grid.component.fixture';
import { SelectionBoxTestComponent } from './selection-box.component.fixture';

@NgModule({
  declarations: [SelectionBoxTestComponent, SelectionBoxGridTestComponent],
  imports: [
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyIdModule,
    SkyRadioModule,
    SkySelectionBoxModule,
  ],
})
export class SkySelectionBoxFixturesModule {}
