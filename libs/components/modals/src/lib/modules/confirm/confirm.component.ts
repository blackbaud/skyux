import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { SkyIdModule, SkyIdService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyThemeModule } from '@skyux/theme';

import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyModalContentComponent } from '../modal/modal-content.component';
import { SkyModalInstance } from '../modal/modal-instance';
import { SkyModalComponent } from '../modal/modal.component';
import { SkyModalsResourcesModule } from '../shared/sky-modals-resources.module';

import { SkyConfirmButton } from './confirm-button';
import { SkyConfirmButtonConfig } from './confirm-button-config';
import { SkyConfirmCloseEventArgs } from './confirm-closed-event-args';
import { SKY_CONFIRM_CONFIG } from './confirm-config-token';
import { SkyConfirmInstance } from './confirm-instance';
import { SkyConfirmType } from './confirm-type';

/**
 * @internal
 */
@Component({
  selector: 'sky-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  imports: [
    CommonModule,
    SkyIdModule,
    SkyModalComponent,
    SkyModalContentComponent,
    SkyModalsResourcesModule,
    SkyThemeModule,
  ],
})
export class SkyConfirmComponent implements OnDestroy {
  protected body: string | undefined;
  protected bodyId: string;
  protected buttons: SkyConfirmButton[] | undefined;
  protected isOkType = false;
  protected message: string;
  protected preserveWhiteSpace = false;

  #ngUnsubscribe = new Subject<void>();

  readonly #config = inject(SKY_CONFIRM_CONFIG);
  readonly #modalInstance = inject(SkyModalInstance);
  readonly #confirmInstance = inject(SkyConfirmInstance);
  readonly #resourcesSvc = inject(SkyLibResourcesService);
  readonly #idSvc = inject(SkyIdService);

  constructor() {
    this.#config.type ??= SkyConfirmType.OK;

    if (
      this.#config.type === SkyConfirmType.Custom &&
      this.#config.buttons &&
      this.#config.buttons.length > 0
    ) {
      this.buttons = this.#getCustomButtons(this.#config.buttons);
    } else {
      this.#getPresetButtons()
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((buttons) => {
          this.buttons = buttons;
        });
    }

    this.message = this.#config.message;
    this.body = this.#config.body;

    // Using the service here instead of the directive due to the confirm
    // component's "body" container being conditional and thus a template
    // variable being unavailable at an outer scope
    this.bodyId = this.#idSvc.generateId();

    this.preserveWhiteSpace = !!this.#config.preserveWhiteSpace;
    this.isOkType = this.#config.type === SkyConfirmType.OK;

    // Closes the modal when requested by the confirm instance.
    this.#confirmInstance.closed.subscribe((args) => {
      this.#modalInstance.close(args);
    });

    this.#modalInstance.closed.subscribe((args) => {
      // Close the confirm when the "escape" key is pressed (passes 'undefined')
      // since this behavior is handled by the underlying modal component.
      if (args.data === undefined) {
        this.#confirmInstance.close({
          action: 'cancel',
        });
      }
    });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  protected close(button: SkyConfirmButton): void {
    const result: SkyConfirmCloseEventArgs = {
      action: button.action,
    };

    this.#confirmInstance.close(result);
  }

  #getPresetButtons(): Observable<SkyConfirmButton[]> {
    const emitter = new ReplaySubject<SkyConfirmButton[]>(1);

    this.#resourcesSvc
      .getStrings({
        cancel: 'skyux_confirm_dialog_default_cancel_text',
        no: 'skyux_confirm_dialog_default_no_text',
        ok: 'skyux_confirm_dialog_default_ok_text',
        yes: 'skyux_confirm_dialog_default_yes_text',
      })
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((values) => {
        const confirmButtons: SkyConfirmButton[] = [];

        switch (this.#config.type) {
          case SkyConfirmType.YesNoCancel:
          case SkyConfirmType.YesCancel:
            confirmButtons.push({
              text: values.yes,
              autofocus: true,
              styleType: 'primary',
              action: 'yes',
            });

            if (this.#config.type === SkyConfirmType.YesNoCancel) {
              confirmButtons.push({
                text: values.no,
                styleType: 'default',
                action: 'no',
              });
            }

            confirmButtons.push({
              text: values.cancel,
              styleType: 'link',
              action: 'cancel',
            });
            break;
          default:
            confirmButtons.push({
              text: values.ok,
              autofocus: true,
              styleType: 'primary',
              action: 'ok',
            });
        }

        emitter.next(confirmButtons);
      });

    return emitter.asObservable();
  }

  #getCustomButtons(
    buttonConfig: SkyConfirmButtonConfig[],
  ): SkyConfirmButton[] {
    return buttonConfig.map(
      (config) =>
        ({
          text: config.text,
          action: config.action,
          styleType: config.styleType || 'default',
          autofocus: config.autofocus || false,
        }) as SkyConfirmButton,
    );
  }
}
