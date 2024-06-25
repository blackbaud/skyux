import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIconModule } from '@skyux/icon';
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
    SkyIconModule,
    SkyPhoneFieldResourcesModule,
    SkyThemeModule,
  ],
  exports: [SkyPhoneFieldComponent, SkyPhoneFieldInputDirective],
})
export class SkyPhoneFieldModule {}
