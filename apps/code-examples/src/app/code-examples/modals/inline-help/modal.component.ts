import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyHelpInlineModule, SkyWaitService } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { ModalDemoContext } from './context';
import { ModalDemoDataService } from './data.service';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [
    ReactiveFormsModule,
    SkyHelpInlineModule,
    SkyInputBoxModule,
    SkyModalModule,
  ],
})
export class ModalComponent {
  public demoForm: FormGroup<{
    value1: FormControl<string | null | undefined>;
  }>;

  #dataSvc: ModalDemoDataService;
  #instance: SkyModalInstance;
  #waitSvc: SkyWaitService;

  constructor(
    instance: SkyModalInstance,
    waitSvc: SkyWaitService,
    dataSvc: ModalDemoDataService,
    context: ModalDemoContext,
    fb: FormBuilder,
  ) {
    this.#instance = instance;
    this.#waitSvc = waitSvc;
    this.#dataSvc = dataSvc;

    const value1 = fb.control(context.data.value1);
    this.demoForm = fb.group({ value1 });
  }

  public onActionClick(): void {
    alert('Help inline button clicked!');
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
