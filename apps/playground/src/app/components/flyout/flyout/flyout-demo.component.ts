import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { SkyInfiniteScrollModule } from '@skyux/lists';
import { SkyModalService } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyToastService, SkyToastType } from '@skyux/toast';

import { FlyoutDemoContext } from './flyout-demo-context';
import { FlyoutModalDemoComponent } from './flyout-modal.component';

@Component({
  selector: 'app-flyout-demo',
  templateUrl: './flyout-demo.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyDropdownModule, SkyInfiniteScrollModule],
})
export class FlyoutDemoComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public infiniteScrollData: any[] = [];

  public enableInfiniteScroll = true;

  #nextId = 0;

  public readonly context = inject(FlyoutDemoContext);
  readonly #modalService = inject(SkyModalService);
  readonly #toastService = inject(SkyToastService);
  readonly #router = inject(Router);
  readonly #changeDetector = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    void this.addData(false);
  }

  public openModal(): void {
    this.#modalService.open(FlyoutModalDemoComponent);
  }

  public openMessage(): void {
    this.#toastService.openMessage(`This is a sample toast message.`, {
      type: SkyToastType.Info,
    });
  }

  public async goToPage(): Promise<void> {
    await this.#router.navigate(['/']);
  }

  public async addData(delay = true): Promise<void> {
    const result = await this.#mockRemote(delay);

    this.infiniteScrollData = this.infiniteScrollData.concat(result.data);
    this.enableInfiniteScroll = result.hasMore;
    this.#changeDetector.markForCheck();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #mockRemote(delay: boolean): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = [];

    for (let i = 0; i < 8; i++) {
      data.push({
        name: `Item #${++this.#nextId}`,
      });
    }

    // Simulate async request.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise((resolve: any) => {
      setTimeout(
        () => {
          resolve({
            data,
            hasMore: this.#nextId < 24,
          });
        },
        delay ? 1000 : 0,
      );
    });
  }
}
