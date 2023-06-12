import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { SkyDateRangePickerModule } from '@skyux/datetime';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';
import { SkySectionedFormModule } from '@skyux/tabs';

import { SectionedFormAddressFormDemoComponent } from './sectioned-form-address-form-demo.component';
import { SectionedFormDateFormDemoComponent } from './sectioned-form-date-form-demo.component';
import { SectionedFormInformationFormDemoComponent } from './sectioned-form-information-form-demo.component';
import { SectionedFormModalComponent } from './sectioned-form-modal.component';
import { SectionedFormPhoneFormDemoComponent } from './sectioned-form-phone-form-demo.component';
import { SectionedFormComponent } from './sectioned-form.component';

const routes: Route[] = [{ path: '', component: SectionedFormComponent }];
@NgModule({
  declarations: [
    SectionedFormComponent,
    SectionedFormAddressFormDemoComponent,
    SectionedFormDateFormDemoComponent,
    SectionedFormInformationFormDemoComponent,
    SectionedFormModalComponent,
    SectionedFormPhoneFormDemoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SkyCheckboxModule,
    SkyDateRangePickerModule,
    SkyModalModule,
    SkySectionedFormModule,
  ],
  exports: [SectionedFormComponent],
})
export class SectionedFormModule {}
