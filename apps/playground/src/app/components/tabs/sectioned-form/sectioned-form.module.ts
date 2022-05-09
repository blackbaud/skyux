import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';
import { SkySectionedFormModule } from '@skyux/tabs';

import { SectionedFormAddressFormDemoComponent } from './sectioned-form-address-form-demo.component';
import { SectionedFormInformationFormDemoComponent } from './sectioned-form-information-form-demo.component';
import { SectionedFormModalComponent } from './sectioned-form-modal.component';
import { SectionedFormPhoneFormDemoComponent } from './sectioned-form-phone-form-demo.component';
import { SectionedFormRoutingModule } from './sectioned-form-routing.module';
import { SectionedFormComponent } from './sectioned-form.component';

@NgModule({
  declarations: [
    SectionedFormComponent,
    SectionedFormAddressFormDemoComponent,
    SectionedFormInformationFormDemoComponent,
    SectionedFormModalComponent,
    SectionedFormPhoneFormDemoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyModalModule,
    SkySectionedFormModule,
    SectionedFormRoutingModule,
  ],
})
export class SectionedFormModule {}
