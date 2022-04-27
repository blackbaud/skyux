import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyUrlValidationModule } from '../url-validation.module';

import { UrlValidationThirdPartyTestComponent } from './url-validation-thirdparty.component.fixture';
import { UrlValidationTestComponent } from './url-validation.component.fixture';

@NgModule({
  declarations: [
    UrlValidationTestComponent,
    UrlValidationThirdPartyTestComponent,
  ],
  imports: [FormsModule, CommonModule, SkyUrlValidationModule],
  exports: [UrlValidationTestComponent, UrlValidationThirdPartyTestComponent],
})
export class SkyUrlValidationFixturesModule {}
