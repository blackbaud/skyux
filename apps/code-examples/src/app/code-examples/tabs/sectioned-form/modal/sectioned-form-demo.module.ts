import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
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
  exports: [SectionedFormDemoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkySectionedFormModule,
    SkyStatusIndicatorModule,
  ],
})
export class SectionedFormDemoModule {}
