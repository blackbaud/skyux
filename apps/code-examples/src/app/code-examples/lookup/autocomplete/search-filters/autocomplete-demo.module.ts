import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyAutocompleteModule } from '@skyux/lookup';

import { AutocompleteDemoComponent } from './autocomplete-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyIdModule,
    SkyInputBoxModule,
  ],
  declarations: [AutocompleteDemoComponent],
  exports: [AutocompleteDemoComponent],
})
export class AutocompleteDemoModule {}
