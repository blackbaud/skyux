import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
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
  standalone: true,
  imports: [
    CommonModule,
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
  public activeIndexDisplay: number | undefined;

  public activeTab = true;

  @ViewChild(SkySectionedFormComponent)
  public sectionedFormComponent: SkySectionedFormComponent | undefined;

  #changeDetector: ChangeDetectorRef;

  constructor(
    public modalInstance: SkyModalInstance,
    changeDetector: ChangeDetectorRef
  ) {
    this.#changeDetector = changeDetector;
  }

  public onIndexChanged(newIndex: number): void {
    this.activeIndexDisplay = newIndex;
    this.#changeDetector.markForCheck();
  }

  public tabsHidden(): boolean {
    return !this.sectionedFormComponent?.tabsVisible();
  }

  public showTabs(): void {
    this.sectionedFormComponent?.showTabs();
  }
}
