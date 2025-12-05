import { Component, OnDestroy, inject } from '@angular/core';
import { SkyWaitService } from '@skyux/indicators';
import {
  SkyModalConfigurationInterface,
  SkyModalConfigurationSizeType,
  SkyModalService,
} from '@skyux/modals';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ModalDemoContext } from './context';
import { ModalDemoData } from './data';
import { ModalDemoDataService } from './data.service';
import { ModalComponent } from './modal.component';

/**
 * @title Modal with a help key
 */
@Component({
  selector: 'app-modals-modal-basic-with-harness-help-key-example',
  templateUrl: './example.component.html',
})
export class ModalsModalBasicWithHarnessHelpKeyExampleComponent
  implements OnDestroy
{
  protected modalSize: SkyModalConfigurationSizeType = 'medium';
  protected exampleValue: string | null | undefined;

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
        };

        // Show the modal after data is loaded.
        const instance = this.#modalSvc.open(ModalComponent, options);

        instance.closed.subscribe((result) => {
          if (result.reason === 'save') {
            // Display the updated value.
            this.exampleValue = (result.data as ModalDemoData).value1;
          }
        });
      });
  }
}
