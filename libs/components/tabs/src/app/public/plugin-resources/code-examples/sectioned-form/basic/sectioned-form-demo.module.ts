import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyCheckboxModule,
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkySectionedFormModule
} from '@skyux/tabs';

import {
  DemoAddressFormComponent
} from './demo-address-form.component';

import {
  DemoInformationFormComponent
} from './demo-information-form.component';

import {
  DemoPhoneFormComponent
} from './demo-phone-form.component';

import {
  SectionedFormDemoComponent
} from './sectioned-form-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkySectionedFormModule
  ],
  declarations: [
    DemoAddressFormComponent,
    DemoInformationFormComponent,
    DemoPhoneFormComponent,
    SectionedFormDemoComponent
  ],
  exports: [
    SectionedFormDemoComponent
  ]
})

export class SectionedFormDemoModule { }
