import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';
import { SkySectionedFormModule } from '@skyux/tabs';

import { AddressFormDemoComponent } from './address-form-demo.component';
import { InformationFormDemoComponent } from './information-form-demo.component';
import { PhoneFormDemoComponent } from './phone-form-demo.component';
import { SectionedFormDemoComponent } from './sectioned-form-demo.component';
import { SectionedFormModalDemoComponent } from './sectioned-form-modal-demo.component';

@NgModule({
  declarations: [
    AddressFormDemoComponent,
    InformationFormDemoComponent,
    PhoneFormDemoComponent,
    SectionedFormModalDemoComponent,
    SectionedFormDemoComponent,
  ],
  entryComponents: [SectionedFormModalDemoComponent],
  exports: [SectionedFormDemoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkySectionedFormModule,
  ],
})
export class SectionedFormDemoModule {}
