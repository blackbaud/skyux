import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitService } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { ModalDemoDataService } from './data.service';
import { DemoSplitViewComponent } from './demosplitview.component';

@Component({
  selector: 'app-split-view-modal',
  templateUrl: './modal.component.html',
  imports: [
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyModalModule,
    DemoSplitViewComponent,
  ],
})
export class SplitViewModalComponent {
  protected demoForm: FormGroup<{
    value1: FormControl<string | null | undefined>;
  }>;

  readonly #dataSvc = inject(ModalDemoDataService);
  readonly #instance = inject(SkyModalInstance);
  readonly #waitSvc = inject(SkyWaitService);

  constructor() {
    this.demoForm = new FormGroup({
      value1: new FormControl('hello world.'),
    });
  }

  protected saveForm(): void {
    // Use the data service to save the data.

    this.#waitSvc
      .blockingWrap(this.#dataSvc.save(this.demoForm.value))
      .subscribe((data) => {
        // Notify the modal instance that data was saved and return the saved data.
        this.#instance.save(data);
      });
  }

  protected cancelForm(): void {
    this.#instance.cancel();
  }
}
