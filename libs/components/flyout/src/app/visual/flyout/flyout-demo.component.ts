import {
  Component, OnInit, ChangeDetectorRef
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
export class FlyoutDemoComponent implements OnInit {

  public infiniteScrollData: any[] = [];

  public enableInfiniteScroll = true;

  private nextId = 0;

  constructor(
    public context: FlyoutDemoContext,
    private modalService: SkyModalService,
    private toastService: SkyToastService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.addData(false);
  }

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

  public addData(delay = true): void {
    this.mockRemote(delay).then((result: any) => {
      this.infiniteScrollData = this.infiniteScrollData.concat(result.data);
      this.enableInfiniteScroll = result.hasMore;
      this.changeDetector.markForCheck();
    });
  }

  private mockRemote(delay: boolean): Promise<any> {
    const data: any[] = [];

    for (let i = 0; i < 8; i++) {
      data.push({
        name: `Item #${++this.nextId}`
      });
    }

    // Simulate async request.
    return new Promise((resolve: any) => {
      setTimeout(() => {
        resolve({
          data,
          hasMore: (this.nextId < 24)
        });
      }, delay ? 1000 : 0);
    });
  }

}
