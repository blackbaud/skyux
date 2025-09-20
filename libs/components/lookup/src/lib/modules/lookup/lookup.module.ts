import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyTokensModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyAutocompleteModule } from '../autocomplete/autocomplete.module';
import { SkyLookupResourcesModule } from '../shared/sky-lookup-resources.module';

import { SkyLookupComponent } from './lookup.component';

@NgModule({
  declarations: [SkyLookupComponent],
  imports: [
    CommonModule,
    SkyAutocompleteModule,
    SkyIconModule,
    SkyLookupResourcesModule,
    SkyThemeModule,
    SkyTokensModule,
  ],
  exports: [SkyLookupComponent],
})
export class SkyLookupModule {}
