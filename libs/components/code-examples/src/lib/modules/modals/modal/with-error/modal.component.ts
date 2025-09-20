import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalError, SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { ModalDemoContext } from './context';
import { ModalDemoDataService } from './data.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [ReactiveFormsModule, SkyInputBoxModule, SkyModalModule],
})
export class ModalComponent {
  protected exampleForm: FormGroup<{
    value1: FormControl<string | null | undefined>;
  }>;

  readonly #context = inject(ModalDemoContext);
  readonly #dataSvc = inject(ModalDemoDataService);
  readonly #instance = inject(SkyModalInstance);
  readonly #waitSvc = inject(SkyWaitService);

  public errors: SkyModalError[] = [];

  constructor() {
    this.exampleForm = new FormGroup({
      value1: new FormControl(this.#context.data.value1),
    });
  }

  protected saveForm(): void {
    // Use the data service to save the data.

    this.#waitSvc
      .blockingWrap(this.#dataSvc.save(this.exampleForm.value))
      .subscribe((data) => {
        // Notify the modal instance that data was saved and return the saved data.
        this.#instance.save(data);
      });
  }

  protected saveFormWithFormError(): void {
    // Use the data service to save the data.

    this.#waitSvc
      .blockingWrap(this.#dataSvc.save(this.exampleForm.value, true))
      .subscribe(() => {
        this.errors = [{ message: 'There was an error saving the form.' }];
      });
  }

  protected cancelForm(): void {
    this.#instance.cancel();
  }
}
