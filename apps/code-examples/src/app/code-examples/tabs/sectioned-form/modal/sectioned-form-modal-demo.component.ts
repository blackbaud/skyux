import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { SkyIconModule } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkySectionedFormComponent, SkySectionedFormModule } from '@skyux/tabs';

import { AddressFormDemoComponent } from './address-form-demo.component';
import { InformationFormDemoComponent } from './information-form-demo.component';
import { PhoneFormDemoComponent } from './phone-form-demo.component';

@Component({
  standalone: true,
  selector: 'app-sectioned-form-modal-demo',
  templateUrl: './sectioned-form-modal-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AddressFormDemoComponent,
    CommonModule,
    InformationFormDemoComponent,
    PhoneFormDemoComponent,
    SkyIconModule,
    SkyModalModule,
    SkySectionedFormModule,
  ],
})
export class SectionedFormModalDemoComponent {
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
