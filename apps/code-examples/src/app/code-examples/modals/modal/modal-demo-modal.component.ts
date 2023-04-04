import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SkyWaitService } from '@skyux/indicators';
import {
  SkyConfirmService,
  SkyConfirmType,
  SkyModalBeforeCloseHandler,
  SkyModalInstance,
} from '@skyux/modals';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ModalDemoContext } from './modal-demo-context';
import { ModalDemoDataService } from './modal-demo-data.service';

@Component({
  selector: 'app-modal-demo-modal',
  templateUrl: './modal-demo-modal.component.html',
})
export class ModalDemoModalComponent implements OnInit {
  protected demoForm: FormGroup<{
    value1: FormControl<string | null | undefined>;
  }>;

  #ngUnsubscribe = new Subject<void>();

  #confirmSvc = inject(SkyConfirmService);
  #instance = inject(SkyModalInstance);
  #waitSvc = inject(SkyWaitService);
  #context = inject(ModalDemoContext);
  #dataSvc = inject(ModalDemoDataService);

  constructor() {
    this.demoForm = new FormGroup({
      value1: new FormControl(this.#context.data.value1),
    });
  }

  public ngOnInit(): void {
    // Display a confirmation dialog based on how the modal is being closed.
    this.#instance.beforeClose
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((args) => this.#confirmClose(args));
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

  #confirmClose(args: SkyModalBeforeCloseHandler): void {
    if (args.closeArgs.reason === 'close' && this.demoForm.dirty) {
      // The user closed the form either by clicking the close button
      // or pressing Escape. Confirm that the user wants to discard
      // unsaved changes. Note that clicking Cancel does not require
      // confirmation.
      const confirm = this.#confirmSvc.open({
        message:
          'You have unsaved changes that will be lost. Are you sure you want to close the form?',
        buttons: [
          {
            action: 'no',
            styleType: 'primary',
            text: 'No',
          },
          {
            action: 'yes',
            text: 'Yes',
          },
        ],
        type: SkyConfirmType.Custom,
      });

      confirm.closed
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((confirmArgs) => {
          if (confirmArgs.action === 'yes') {
            args.closeModal();
          }
        });
    } else {
      args.closeModal();
    }
  }
}
