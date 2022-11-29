import { Component, OnDestroy } from '@angular/core';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ModalDemoContext } from './modal-demo-context';
import { ModalDemoData } from './modal-demo-data';
import { ModalDemoDataService } from './modal-demo-data.service';
import { ModalDemoModalComponent } from './modal-demo-modal.component';

@Component({
  selector: 'app-modal-demo',
  templateUrl: './modal-demo.component.html',
})
export class ModalDemoComponent implements OnDestroy {
  public helpKey = 'help-demo.html';

  public modalSize = 'medium';

  public demoValue: string | undefined;

  #ngUnsubscribe = new Subject<void>();

  #modalSvc: SkyModalService;
  #waitSvc: SkyWaitService;
  #dataSvc: ModalDemoDataService;

  constructor(
    modalSvc: SkyModalService,
    waitSvc: SkyWaitService,
    dataSvc: ModalDemoDataService
  ) {
    this.#modalSvc = modalSvc;
    this.#waitSvc = waitSvc;
    this.#dataSvc = dataSvc;
  }

  public onOpenModalClick(): void {
    // Display a blocking wait while data is loaded from the data service.
    this.#waitSvc
      .blockingWrap(this.#dataSvc.load())
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((data) => {
        const options: SkyModalConfigurationInterface = {
          helpKey: this.helpKey,
          providers: [
            {
              provide: ModalDemoContext,
              useValue: new ModalDemoContext(data),
            },
          ],
          size: this.modalSize,
        };

        // Show the modal after data is loaded.
        const instance = this.#modalSvc.open(ModalDemoModalComponent, options);

        instance.closed.subscribe((result) => {
          if (result.reason === 'save') {
            // Display the updated value.
            const data = result.data as ModalDemoData;
            this.demoValue = data.value1;
          }
        });
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
