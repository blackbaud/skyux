import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkySectionedFormComponent, SkySectionedFormModule } from '@skyux/tabs';

import { AddressFormComponent } from './address-form.component';
import { InformationFormComponent } from './information-form.component';
import { PhoneFormComponent } from './phone-form.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AddressFormComponent,
    InformationFormComponent,
    PhoneFormComponent,
    SkyIconModule,
    SkyModalModule,
    SkySectionedFormModule,
  ],
})
export class ModalComponent {
  @ViewChild(SkySectionedFormComponent)
  protected sectionedFormComponent: SkySectionedFormComponent | undefined;

  protected activeIndexDisplay: number | undefined;
  protected activeTab = true;

  protected readonly modalInstance = inject(SkyModalInstance);
  readonly #changeDetector = inject(ChangeDetectorRef);

  protected onIndexChanged(newIndex: number): void {
    this.activeIndexDisplay = newIndex;
    this.#changeDetector.markForCheck();
  }

  protected tabsHidden(): boolean {
    return !this.sectionedFormComponent?.tabsVisible();
  }

  protected showTabs(): void {
    this.sectionedFormComponent?.showTabs();
  }
}
