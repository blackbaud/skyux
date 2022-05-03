import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AutocompleteComponent } from './autocomplete.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AutocompleteComponent,
      },
    ]),
  ],
})
export class AutocompleteRoutingModule {}
