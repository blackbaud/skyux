import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyUrlValidationModule } from '../url-validation.module';

import { UrlValidationRulesetV2TestComponent } from './url-validation-thirdparty.component.fixture';
import { UrlValidationTestComponent } from './url-validation.component.fixture';

@NgModule({
  declarations: [
    UrlValidationTestComponent,
    UrlValidationRulesetV2TestComponent,
  ],
  imports: [FormsModule, CommonModule, SkyUrlValidationModule],
  exports: [UrlValidationTestComponent, UrlValidationRulesetV2TestComponent],
})
export class SkyUrlValidationFixturesModule {}
