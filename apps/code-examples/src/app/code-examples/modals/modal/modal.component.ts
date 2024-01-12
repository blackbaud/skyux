import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { ModalDemoContext } from './context';
import { ModalDemoDataService } from './data.service';
@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyCheckboxModule,
  ],
})
export class ModalComponent {
  protected demoForm: FormGroup<{
    value1: FormControl<string | null | undefined>;
    checkbox: FormControl<boolean | null>;
  }>;

  readonly #context = inject(ModalDemoContext);
  readonly #dataSvc = inject(ModalDemoDataService);
  readonly #instance = inject(SkyModalInstance);
  readonly #waitSvc = inject(SkyWaitService);

  constructor() {
    this.demoForm = new FormGroup({
      value1: new FormControl(this.#context.data.value1),
      checkbox: new FormControl(false),
    });
  }

  protected saveForm(): void {
    // Mark all fields as touched to ensure validation has run
    this.demoForm.markAllAsTouched();

    // Use the data service to save the data.
    if (this.demoForm.valid) {
      this.#waitSvc
        .blockingWrap(this.#dataSvc.save(this.demoForm.value))
        .subscribe((data) => {
          // Notify the modal instance that data was saved and return the saved data.
          this.#instance.save(data);
        });
    }
  }

  protected cancelForm(): void {
    this.#instance.cancel();
  }
}
