import {
  Directive,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyConfirmType } from '../confirm/confirm-type';
import { SkyConfirmService } from '../confirm/confirm.service';

import { SkyModalBeforeCloseHandler } from './modal-before-close-handler';
import { SkyModalInstance } from './modal-instance';

/**
 * Provides a way to mark a modal as "dirty" and displays a confirmation
 * message when a user closes the modal without saving.
 */
@Directive({
  // Since this is limited to sky-modal, it should be safe to
  // leave off the sky prefix.
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sky-modal[isDirty]',
})
export class SkyModalIsDirtyDirective implements OnInit, OnDestroy {
  /**
   * Whether the user edited an input on the modal.
   * @required
   */
  @Input()
  // This attribute is being applied to the host to support
  // unit testing this feature.
  @HostBinding('attr.data-sky-modal-is-dirty')
  public isDirty = false;

  readonly #ngUnsubscribe = new Subject<void>();

  readonly #modalInstance = inject(SkyModalInstance);
  readonly #confirmSvc = inject(SkyConfirmService);
  readonly #resourcesSvc = inject(SkyLibResourcesService);

  public ngOnInit(): void {
    this.#modalInstance.beforeClose
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((handler) => this.#promptIfDirty(handler));
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #promptIfDirty(handler: SkyModalBeforeCloseHandler): void {
    if (
      this.isDirty &&
      (handler.closeArgs.reason === 'close' ||
        handler.closeArgs.reason === 'cancel')
    ) {
      this.#resourcesSvc
        .getStrings({
          message: 'skyux_modal_dirty_default_message',
          discardActionText: 'skyux_modal_dirty_default_discard_changes_text',
          keepActionText: 'skyux_modal_dirty_default_keep_working_text',
        })
        .subscribe((textValues) => {
          const discardAction = 'discard';
          const keepAction = 'keep';

          this.#confirmSvc
            .open({
              message: textValues.message,
              buttons: [
                {
                  action: discardAction,
                  text: textValues.discardActionText,
                  styleType: 'primary',
                },
                {
                  action: keepAction,
                  text: textValues.keepActionText,
                  styleType: 'link',
                },
              ],
              type: SkyConfirmType.Custom,
            })
            .closed.subscribe((args) => {
              if (args.action === discardAction) {
                handler.closeModal();
              }
            });
        });
    } else {
      handler.closeModal();
    }
  }
}
