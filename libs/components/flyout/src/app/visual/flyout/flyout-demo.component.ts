import {
  Component
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  SkyModalService
} from '@skyux/modals';

import {
  SkyToastService,
  SkyToastType
} from '@skyux/toast';

import {
  SkyFlyoutService
} from '../../public/modules/flyout/flyout.service';

import {
  SkyFlyoutModalDemoComponent
} from './flyout-modal.component';

import {
  FlyoutDemoContext
} from './flyout-demo-context';

@Component({
  selector: 'sky-test-cmp-flyout',
  templateUrl: './flyout-demo.component.html',
  providers: [SkyFlyoutService]
})
export class FlyoutDemoComponent {

  constructor(
    public context: FlyoutDemoContext,
    private modalService: SkyModalService,
    private toastService: SkyToastService,
    private router: Router
  ) { }

  public openModal(): void {
    this.modalService.open(SkyFlyoutModalDemoComponent);
  }

  public openMessage(): void {
    this.toastService.openMessage(
      `This is a sample toast message.`,
      {
        type: SkyToastType.Info
      }
    );
  }

  public goToPage(): void {
    this.router.navigate(['/']);
  }

}
