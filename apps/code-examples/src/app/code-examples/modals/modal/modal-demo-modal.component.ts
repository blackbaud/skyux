import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalInstance } from '@skyux/modals';

import { ModalDemoContext } from './modal-demo-context';
import { ModalDemoDataService } from './modal-demo-data.service';

@Component({
  selector: 'app-modal-demo-modal',
  templateUrl: './modal-demo-modal.component.html',
})
export class ModalDemoModalComponent {
  protected demoForm: FormGroup<{
    value1: FormControl<string | null | undefined>;
  }>;

  #instance = inject(SkyModalInstance);
  #waitSvc = inject(SkyWaitService);
  #context = inject(ModalDemoContext);
  #dataSvc = inject(ModalDemoDataService);

  constructor() {
    this.demoForm = new FormGroup({
      value1: new FormControl(this.#context.data.value1),
    });
  }

  public saveForm(): void {
    // Use the data service to save the data.

    this.#waitSvc
      .blockingWrap(this.#dataSvc.save(this.demoForm.value))
      .subscribe((data) => {
        // Notify the modal instance that data was saved and return the saved data.
        this.#instance.save(data);
      });
  }

  public cancelForm(): void {
    this.#instance.cancel();
  }
}
