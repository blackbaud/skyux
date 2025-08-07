import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkySectionedFormComponent, SkySectionedFormModule } from '@skyux/tabs';

import { SectionedFormAddressFormDemoComponent } from './sectioned-form-address-form-demo.component';
import { SectionedFormDateFormDemoComponent } from './sectioned-form-date-form-demo.component';
import { SectionedFormInformationFormDemoComponent } from './sectioned-form-information-form-demo.component';
import { SectionedFormPhoneFormDemoComponent } from './sectioned-form-phone-form-demo.component';

@Component({
  selector: 'app-sectioned-form-modal',
  templateUrl: './sectioned-form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SectionedFormAddressFormDemoComponent,
    SectionedFormDateFormDemoComponent,
    SectionedFormInformationFormDemoComponent,
    SectionedFormPhoneFormDemoComponent,
    SkyModalModule,
    SkySectionedFormModule,
  ],
})
export class SectionedFormModalComponent {
  @ViewChild('sectionedFormComponent', { static: true })
  public sectionedFormComponent: SkySectionedFormComponent | undefined;

  public maintainSectionContent = false;

  public readonly modal = inject(SkyModalInstance);

  public tabsHidden(): boolean {
    return !this.sectionedFormComponent?.tabsVisible();
  }

  public showTabs(): void {
    this.sectionedFormComponent?.showTabs();
  }
}
