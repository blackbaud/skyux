import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyAutofillDirective
} from './autofill.directive';

@NgModule({
  declarations: [
    SkyAutofillDirective
  ],
  imports: [
    FormsModule
  ],
  exports: [
    SkyAutofillDirective
  ]
})
export class SkyAutofillModule { }
