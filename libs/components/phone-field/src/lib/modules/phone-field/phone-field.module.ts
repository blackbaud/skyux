import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/indicators';
import { SkyCountryFieldModule } from '@skyux/lookup';
import { SkyThemeModule } from '@skyux/theme';

import { SkyPhoneFieldResourcesModule } from '../shared/sky-phone-field-resources.module';

import { SkyPhoneFieldInputDirective } from './phone-field-input.directive';
import { SkyPhoneFieldComponent } from './phone-field.component';

@NgModule({
  declarations: [SkyPhoneFieldComponent, SkyPhoneFieldInputDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCountryFieldModule,
    SkyI18nModule,
    SkyIconModule,
    SkyPhoneFieldResourcesModule,
    SkyThemeModule,
  ],
  exports: [SkyPhoneFieldComponent, SkyPhoneFieldInputDirective],
})
export class SkyPhoneFieldModule {}
