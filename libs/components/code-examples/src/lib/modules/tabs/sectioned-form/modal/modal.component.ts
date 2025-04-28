import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import {
  SkySectionedFormMessage,
  SkySectionedFormMessageType,
  SkySectionedFormModule,
} from '@skyux/tabs';

import { Subject } from 'rxjs';

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
  protected activeIndexDisplay: number | undefined;
  protected activeTab = true;
  protected sectionedFormController = new Subject<SkySectionedFormMessage>();
  protected tabsHidden = false;

  protected readonly modalInstance = inject(SkyModalInstance);
  readonly #changeDetector = inject(ChangeDetectorRef);

  protected onIndexChanged(newIndex: number): void {
    this.activeIndexDisplay = newIndex;
    this.#changeDetector.markForCheck();
  }

  protected onTabsVisibleChanged(visible: boolean): void {
    this.tabsHidden = !visible;
  }

  protected showTabs(): void {
    this.sectionedFormController.next({
      type: SkySectionedFormMessageType.ShowTabs,
    });
  }
}
