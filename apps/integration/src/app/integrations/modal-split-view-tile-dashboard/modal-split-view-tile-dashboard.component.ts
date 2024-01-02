import { Component, OnDestroy, inject } from '@angular/core';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { Subject, takeUntil } from 'rxjs';

import { ModalDemoContext } from './context';
import { ModalDemoData } from './data';
import { ModalDemoDataService } from './data.service';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-modal-split-view-tile-dashboard',
  templateUrl: './modal-split-view-tile-dashboard.component.html',
})
export class ModalSplitViewTileDashboardComponent implements OnDestroy {
  protected modalSize = 'medium';
  protected demoValue: string | null | undefined;

  #ngUnsubscribe = new Subject<void>();

  readonly #dataSvc = inject(ModalDemoDataService);
  readonly #modalSvc = inject(SkyModalService);
  readonly #waitSvc = inject(SkyWaitService);

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onOpenModalClick(): void {
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
          size: this.modalSize,
          fullPage: true,
        };

        // Show the modal after data is loaded.
        const instance = this.#modalSvc.open(ModalComponent, options);

        instance.closed.subscribe((result) => {
          if (result.reason === 'save') {
            // Display the updated value.
            const data = result.data as ModalDemoData;
            this.demoValue = data.value1;
          }
        });
      });
  }
}
