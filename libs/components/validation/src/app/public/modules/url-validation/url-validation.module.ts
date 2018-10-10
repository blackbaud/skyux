import {
  NgModule
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';

import {
  SkyUrlValidationDirective
} from './url-validation.directive';

@NgModule({
  declarations: [
    SkyUrlValidationDirective
  ],
  imports: [
    FormsModule
  ],
  exports: [
    SkyUrlValidationDirective
  ]
})
export class SkyUrlValidationModule { }
