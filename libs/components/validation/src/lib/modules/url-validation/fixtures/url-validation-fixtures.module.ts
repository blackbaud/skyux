import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyUrlValidationModule } from '../url-validation.module';

import { UrlValidationRulesetTestComponent } from './url-validation-ruleset.component.fixture';
import { UrlValidationTestComponent } from './url-validation.component.fixture';

@NgModule({
  declarations: [UrlValidationTestComponent, UrlValidationRulesetTestComponent],
  imports: [FormsModule, CommonModule, SkyUrlValidationModule],
  exports: [UrlValidationTestComponent, UrlValidationRulesetTestComponent],
})
export class SkyUrlValidationFixturesModule {}
