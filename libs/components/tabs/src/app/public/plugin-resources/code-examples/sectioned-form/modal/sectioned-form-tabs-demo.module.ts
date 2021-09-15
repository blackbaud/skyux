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
  SkyModalModule
} from '@skyux/modals';

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

import {
  SectionedModalFormDemoComponent
} from './sectioned-modal-form-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkySectionedFormModule
  ],
  declarations: [
    DemoAddressFormComponent,
    DemoInformationFormComponent,
    DemoPhoneFormComponent,
    SectionedFormDemoComponent,
    SectionedModalFormDemoComponent
  ],
  entryComponents: [
    SectionedModalFormDemoComponent
  ],
  exports: [
    SectionedFormDemoComponent
  ]
})

export class SectionedFormDemoModule { }
