import { Component } from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { SkyToastService, SkyToastType } from '@skyux/toast';

import { SkyFlyoutService } from '../flyout.service';

import { SkyFlyoutModalFixtureContext } from './flyout-modal-context';
import { SKY_FLYOUT_MODAL_CONTEXT } from './flyout-modal-context-token';
import { SkyFlyoutModalFixtureFormComponent } from './flyout-modal-form.component';

@Component({
  selector: 'sky-test-flyout-internal',
  templateUrl: './flyout-hosts.component.fixture.html',
  providers: [SkyFlyoutService],
  standalone: false,
})
export class SkyFlyoutHostsTestComponent {
  #modal: SkyModalService;
  #toastService: SkyToastService;
  constructor(modal: SkyModalService, toastService: SkyToastService) {
    this.#modal = modal;
    this.#toastService = toastService;
  }

  public openModal(): void {
    const context: SkyFlyoutModalFixtureContext = { valueA: 'Hello' };

    const options: any = {
      providers: [{ provide: SKY_FLYOUT_MODAL_CONTEXT, useValue: context }],
      ariaDescribedBy: 'docs-modal-content',
    };

    this.#modal.open(SkyFlyoutModalFixtureFormComponent, options);
  }

  public openMessage(): void {
    this.#toastService.openMessage(`This is a sample toast message.`, {
      type: SkyToastType.Info,
    });
  }
}
