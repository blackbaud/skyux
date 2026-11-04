import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyButton } from '@skyux/forms';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { ModalDemoContext } from './context';
import { ModalDemoData } from './data';
import { ModalDemoDataService } from './data.service';
import { ModalComponent } from './modal.component';

/**
 * @title Modal with basic setup, tested with harness
 */
@Component({
  selector: 'app-modals-modal-basic-with-harness-example',
  templateUrl: './example.component.html',
  imports: [SkyButton],
})
export class ModalsModalBasicWithHarnessExampleComponent {
  protected modalSize = 'medium';
  protected readonly exampleValue = signal<string | null | undefined>(
    undefined,
  );

  readonly #dataSvc = inject(ModalDemoDataService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #modalSvc = inject(SkyModalService);
  readonly #waitSvc = inject(SkyWaitService);

  public onOpenModalClick(): void {
    // Display a blocking wait while data is loaded from the data service.
    this.#waitSvc
      .blockingWrap(this.#dataSvc.load())
      .pipe(takeUntilDestroyed(this.#destroyRef))
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
            this.exampleValue.set((result.data as ModalDemoData).value1);
          }
        });
      });
  }
}
