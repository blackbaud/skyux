import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyToggleSwitchModule } from '@skyux/forms';
import {
  SkyModalBeforeCloseHandler,
  SkyModalError,
  SkyModalInstance,
  SkyModalModule,
} from '@skyux/modals';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  imports: [FormsModule, SkyModalModule, SkyToggleSwitchModule],
})
export class ModalErrorComponent implements OnInit, OnDestroy {
  public isError = false;

  public errors: SkyModalError[] | undefined;

  #modalInstance = inject(SkyModalInstance);
  #ngUnsubscribe = new Subject<void>();

  public ngOnInit(): void {
    this.#modalInstance.beforeClose
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((handler) => this.#onClose(handler));
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public clearErrors(): void {
    this.errors.pop();
  }

  public save(): void {
    this.#modalInstance.save();
  }

  public cancel(): void {
    this.#modalInstance.cancel();
  }

  #onClose(handler: SkyModalBeforeCloseHandler): void {
    if (this.isError && handler.closeArgs.reason !== 'cancel') {
      this.errors = [
        {
          message:
            "Sample error that's really long so it takes up two lines. More text just to ensure text wrap.",
        },
        { message: 'Sample error 2' },
      ];
    } else {
      handler.closeModal();
    }
  }
}
