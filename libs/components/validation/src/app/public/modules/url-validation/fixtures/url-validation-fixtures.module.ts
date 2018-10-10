import {
  NgModule
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';
import {
  CommonModule
} from '@angular/common';

import {
  SkyUrlValidationModule
} from '../url-validation.module';
import {
  UrlValidationTestComponent
} from './url-validation.component.fixture';

@NgModule({
  declarations: [
    UrlValidationTestComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SkyUrlValidationModule
  ],
  exports: [
    UrlValidationTestComponent
  ]
})
export class SkyUrlValidationFixturesModule { }
