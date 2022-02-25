import { Component } from '@angular/core';

import { SkyModalService } from '@skyux/modals';

import { SkyToastService, SkyToastType } from '@skyux/toast';

import { SkyFlyoutModalFixtureContext } from './flyout-modal-context';

import { SkyFlyoutModalFixtureFormComponent } from './flyout-modal-form.component';

import { SkyFlyoutService } from '../flyout.service';

@Component({
  selector: 'sky-test-flyout-internal',
  templateUrl: './flyout-hosts.component.fixture.html',
  providers: [SkyFlyoutService],
})
export class SkyFlyoutHostsTestComponent {
  constructor(
    private modal: SkyModalService,
    private toastService: SkyToastService
  ) {}

  public openModal(): void {
    const context = new SkyFlyoutModalFixtureContext();
    context.valueA = 'Hello';

    const options: any = {
      providers: [{ provide: SkyFlyoutModalFixtureContext, useValue: context }],
      ariaDescribedBy: 'docs-modal-content',
    };

    this.modal.open(SkyFlyoutModalFixtureFormComponent, options);
  }

  public openMessage(): void {
    this.toastService.openMessage(`This is a sample toast message.`, {
      type: SkyToastType.Info,
    });
  }
}
