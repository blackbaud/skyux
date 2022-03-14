import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SkyAffixModule,
  SkyIdModule,
  SkyNumericModule,
  SkyOverlayModule,
} from '@skyux/core';
import {
  SkyIconModule,
  SkyTextHighlightModule,
  SkyWaitModule,
} from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyLookupResourcesModule } from '../shared/sky-lookup-resources.module';

import { SkyAutocompleteInputDirective } from './autocomplete-input.directive';
import { SkyAutcompleteSearchAsyncDisabledPipe } from './autocomplete-search-async-disabled.pipe';
import { SkyAutocompleteComponent } from './autocomplete.component';

@NgModule({
  declarations: [
    SkyAutocompleteComponent,
    SkyAutocompleteInputDirective,
    SkyAutcompleteSearchAsyncDisabledPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAffixModule,
    SkyTextHighlightModule,
    SkyIconModule,
    SkyIdModule,
    SkyLookupResourcesModule,
    SkyNumericModule,
    SkyOverlayModule,
    SkyThemeModule,
    SkyWaitModule,
  ],
  exports: [SkyAutocompleteComponent, SkyAutocompleteInputDirective],
})
export class SkyAutocompleteModule {}
