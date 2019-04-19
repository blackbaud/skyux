import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyPhoneFieldResourcesModule
} from '../shared';

import {
  SkyPhoneFieldComponent
} from './phone-field.component';

import {
  SkyPhoneFieldInputDirective
} from './phone-field-input.directive';

@NgModule({
  declarations: [
    SkyPhoneFieldComponent,
    SkyPhoneFieldInputDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyDropdownModule,
    SkyI18nModule,
    SkyPhoneFieldResourcesModule
  ],
  exports: [
    SkyPhoneFieldComponent,
    SkyPhoneFieldInputDirective
  ]
})
export class SkyPhoneFieldModule { }
