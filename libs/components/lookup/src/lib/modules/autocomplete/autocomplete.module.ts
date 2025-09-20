import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAffixModule, SkyIdModule, SkyNumericModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyTextHighlightModule, SkyWaitModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyLookupResourcesModule } from '../shared/sky-lookup-resources.module';

import { SkyAutocompleteInputDirective } from './autocomplete-input.directive';
import { SkyAutocompleteSearchAsyncDisabledPipe } from './autocomplete-search-async-disabled.pipe';
import { SkyAutocompleteComponent } from './autocomplete.component';

@NgModule({
  declarations: [
    SkyAutocompleteComponent,
    SkyAutocompleteInputDirective,
    SkyAutocompleteSearchAsyncDisabledPipe,
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
    SkyThemeModule,
    SkyWaitModule,
  ],
  exports: [SkyAutocompleteComponent, SkyAutocompleteInputDirective],
})
export class SkyAutocompleteModule {}
