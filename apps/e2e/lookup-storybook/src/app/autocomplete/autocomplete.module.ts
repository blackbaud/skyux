import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyAutocompleteModule } from '@skyux/lookup';

import { AutocompleteComponent } from './autocomplete.component';

const routes: Routes = [{ path: '', component: AutocompleteComponent }];
@NgModule({
  declarations: [AutocompleteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyAutocompleteModule,
    SkyInputBoxModule,
  ],
  exports: [AutocompleteComponent],
})
export class AutocompleteModule {}
