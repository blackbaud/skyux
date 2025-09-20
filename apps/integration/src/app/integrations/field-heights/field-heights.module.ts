import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyIdModule } from '@skyux/core';
import { SkyDateRangePickerModule, SkyDatepickerModule } from '@skyux/datetime';
import { SkyCharacterCounterModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import {
  SkyAutocompleteModule,
  SkyCountryFieldModule,
  SkyLookupModule,
} from '@skyux/lookup';
import { SkyThemeModule } from '@skyux/theme';

import { FieldHeightsComponent } from './field-heights.component';

const routes: Routes = [
  {
    path: '',
    component: FieldHeightsComponent,
    data: {
      name: 'Field Heights',
      icon: 'text-font-size',
    },
  },
];

@NgModule({
  declarations: [FieldHeightsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SkyAutocompleteModule,
    SkyCharacterCounterModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyLookupModule,
    SkyStatusIndicatorModule,
    SkyThemeModule,
    SkyCountryFieldModule,
    SkyDateRangePickerModule,
    SkyDatepickerModule,
    SkyHelpInlineModule,
  ],
})
export class FieldHeightsModule {
  public static routes = routes;
}
