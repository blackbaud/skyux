import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyButton } from '@skyux/forms';
import { SkyModalService } from '@skyux/modals';
import { FormsButtonInModalExampleModal } from './modal';

/**
 * @title Buttons in modal footer
 */
@Component({
  selector: 'app-forms-button-in-modal-example',
  templateUrl: 'example.html',
  imports: [SkyButton],
})
export class FormsButtonInModalExample {
  readonly #modalSvc = inject(SkyModalService);
  readonly #destroyRef = inject(DestroyRef);

  protected readonly userNames = signal<string[]>([]);

  protected addUserClick(): void {
    const instance = this.#modalSvc.open(FormsButtonInModalExampleModal);

    instance.closed
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result) => {
        if (result.reason === 'save') {
          const user = result.data as {
            userName: string;
          };

          this.userNames.set([...this.userNames(), user.userName]);
        }
      });
  }

  protected deleteUser(index: number): void {
    this.userNames.update((userNames) => {
      userNames.splice(index, 1);

      return userNames;
    });
  }
}
