import { Component, OnDestroy, inject } from '@angular/core';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { Subject, takeUntil } from 'rxjs';

import { ModalDemoContext } from './context';
import { ModalDemoDataService } from './data.service';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-modal-split-view-tile-dashboard',
  templateUrl: './modal-split-view-tile-dashboard.component.html',
  standalone: false,
})
export class ModalSplitViewTileDashboardComponent implements OnDestroy {
  protected demoValue: string | null | undefined;

  #ngUnsubscribe = new Subject<void>();

  readonly #dataSvc = inject(ModalDemoDataService);
  readonly #modalSvc = inject(SkyModalService);
  readonly #waitSvc = inject(SkyWaitService);

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onOpenFullPageModalClick(): void {
    // Display a blocking wait while data is loaded from the data service.
    this.#waitSvc
      .blockingWrap(this.#dataSvc.load())
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((data) => {
        const options: SkyModalConfigurationInterface = {
          providers: [
            {
              provide: ModalDemoContext,
              useValue: new ModalDemoContext(data),
            },
          ],
          fullPage: true,
        };

        this.#modalSvc.open(ModalComponent, options);
      });
  }

  public onOpenLargeModalClick(): void {
    // Display a blocking wait while data is loaded from the data service.
    this.#waitSvc
      .blockingWrap(this.#dataSvc.load())
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((data) => {
        const options: SkyModalConfigurationInterface = {
          providers: [
            {
              provide: ModalDemoContext,
              useValue: new ModalDemoContext(data, 'fit'),
            },
          ],
          size: 'large',
        };

        this.#modalSvc.open(ModalComponent, options);
      });
  }
}
