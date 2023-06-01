import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyConfirmType } from '../confirm/confirm-type';
import { SkyConfirmService } from '../confirm/confirm.service';

import { SkyModalBeforeCloseHandler } from './modal-before-close-handler';
import { SkyModalInstance } from './modal-instance';

/**
 * Provides support for flagging a modal as dirty which will
 * automatically prompt the user whether or not to discard changes
 * when the user tries closing a dirty modal without
 * saving or canceling the modal.
 */
@Directive({
  // Since this is limited to sky-modal, it should be safe to
  // leave off the sky prefix.
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sky-modal[isDirty]',
})
export class SkyModalDiscardPromptDirective implements OnInit, OnDestroy {
  /**
   * Flags whether or not the modal is considered dirty.
   * @required
   */
  @Input()
  public isDirty = false;

  readonly #ngUnsubscribe = new Subject<void>();

  readonly #modalInstance: SkyModalInstance;
  readonly #confirmService: SkyConfirmService;
  readonly #resourcesService: SkyLibResourcesService;

  constructor(
    modalInstance: SkyModalInstance,
    confirmService: SkyConfirmService,
    resourcesService: SkyLibResourcesService
  ) {
    this.#modalInstance = modalInstance;
    this.#confirmService = confirmService;
    this.#resourcesService = resourcesService;
  }

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
    if (this.isDirty && handler.closeArgs.reason === 'close') {
      this.#resourcesService
        .getStrings({
          message: 'skyux_modal_dirty_default_message',
          discardActionText: 'skyux_modal_dirty_default_discard_changes_text',
          keepActionText: 'skyux_modal_dirty_default_keep_working_text',
        })
        .subscribe((textValues) => {
          const discardAction = 'discard';
          const keepAction = 'keep';

          this.#confirmService
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
