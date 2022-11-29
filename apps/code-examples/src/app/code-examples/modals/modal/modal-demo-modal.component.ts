import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalInstance } from '@skyux/modals';

import { ModalDemoContext } from './modal-demo-context';
import { ModalDemoDataService } from './modal-demo-data.service';

@Component({
  selector: 'app-modal-demo-modal',
  templateUrl: './modal-demo-modal.component.html',
})
export class ModalDemoModalComponent {
  public demoForm: FormGroup<{
    value1?: FormControl<string>;
  }>;

  #dataSvc: ModalDemoDataService;
  #instance: SkyModalInstance;
  #waitSvc: SkyWaitService;

  constructor(
    instance: SkyModalInstance,
    waitSvc: SkyWaitService,
    dataSvc: ModalDemoDataService,
    context: ModalDemoContext,
    fb: FormBuilder
  ) {
    this.#instance = instance;
    this.#waitSvc = waitSvc;
    this.#dataSvc = dataSvc;

    this.demoForm = fb.group(context.data);
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
