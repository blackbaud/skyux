import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyModalModule } from '@skyux/modals';
import { SkySectionedFormModule } from '@skyux/tabs';

import { SectionedFormAddressFormDemoComponent } from './sectioned-form-address-form-demo.component';
import { SectionedFormDateFormDemoComponent } from './sectioned-form-date-form-demo.component';
import { SectionedFormInformationFormDemoComponent } from './sectioned-form-information-form-demo.component';
import { SectionedFormPhoneFormDemoComponent } from './sectioned-form-phone-form-demo.component';

@Component({
  selector: 'app-sectioned-form-modal',
  templateUrl: './sectioned-form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SkyModalModule,
    SkySectionedFormModule,
    SectionedFormAddressFormDemoComponent,
    SectionedFormInformationFormDemoComponent,
    SectionedFormPhoneFormDemoComponent,
    SectionedFormDateFormDemoComponent,
  ],
})
export class SectionedFormModalComponent {
  public maintainSectionContent = false;
}
