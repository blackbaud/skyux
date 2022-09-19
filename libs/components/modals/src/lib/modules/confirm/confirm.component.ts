import { Component, Inject, Optional } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { BehaviorSubject, Observable, zip as observableZip } from 'rxjs';

import { SkyModalInstance } from '../modal/modal-instance';

import { SkyConfirmButton } from './confirm-button';
import { SkyConfirmButtonConfig } from './confirm-button-config';
import { SkyConfirmCloseEventArgs } from './confirm-closed-event-args';
import { SkyConfirmConfig } from './confirm-config';
import { SKY_CONFIRM_CONFIG } from './confirm-config-token';
import { SkyConfirmType } from './confirm-type';

@Component({
  selector: 'sky-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class SkyConfirmComponent {
  public buttons: SkyConfirmButton[] | undefined;
  public message: string;
  public body: string | undefined;
  public preserveWhiteSpace = false;
  public isOkType = false;

  #config: SkyConfirmConfig;
  #modal: SkyModalInstance;
  #resourcesService: SkyLibResourcesService;

  constructor(
    @Inject(SKY_CONFIRM_CONFIG)
    config: SkyConfirmConfig,
    modal: SkyModalInstance,
    @Optional() resourcesService: SkyLibResourcesService
  ) {
    this.#config = config;
    this.#modal = modal;
    this.#resourcesService = resourcesService!;

    if (
      config.type === SkyConfirmType.Custom &&
      config.buttons &&
      config.buttons.length > 0
    ) {
      this.buttons = this.#getCustomButtons(config.buttons);
    } else {
      this.#getPresetButtons().subscribe((buttons: SkyConfirmButton[]) => {
        this.buttons = buttons;
      });
    }

    this.message = config.message;
    this.body = config.body;
    this.preserveWhiteSpace = !!config.preserveWhiteSpace;
    this.isOkType = config.type === SkyConfirmType.OK;
  }

  public close(button: SkyConfirmButton) {
    const result: SkyConfirmCloseEventArgs = {
      action: button.action,
    };

    this.#modal.close(result);
  }

  #getPresetButtons(): Observable<SkyConfirmButton[]> {
    const emitter = new BehaviorSubject<SkyConfirmButton[]>([]);

    switch (this.#config.type) {
      default:
      case SkyConfirmType.OK:
        this.#resourcesService
          .getString('skyux_confirm_dialog_default_ok_text')
          .subscribe((value: string) => {
            emitter.next([
              {
                text: value,
                autofocus: true,
                styleType: 'primary',
                action: 'ok',
              },
            ]);
          });
        break;

      case SkyConfirmType.YesNoCancel:
        observableZip(
          this.#resourcesService.getString(
            'skyux_confirm_dialog_default_yes_text'
          ),
          this.#resourcesService.getString(
            'skyux_confirm_dialog_default_no_text'
          ),
          this.#resourcesService.getString(
            'skyux_confirm_dialog_default_cancel_text'
          )
        ).subscribe((values: any) => {
          emitter.next([
            {
              text: values[0],
              autofocus: true,
              styleType: 'primary',
              action: 'yes',
            },
            {
              text: values[1],
              styleType: 'default',
              action: 'no',
            },
            {
              text: values[2],
              styleType: 'link',
              action: 'cancel',
            },
          ]);
        });
        break;

      case SkyConfirmType.YesCancel:
        observableZip(
          this.#resourcesService.getString(
            'skyux_confirm_dialog_default_yes_text'
          ),
          this.#resourcesService.getString(
            'skyux_confirm_dialog_default_cancel_text'
          )
        ).subscribe((values: any) => {
          emitter.next([
            {
              text: values[0],
              autofocus: true,
              styleType: 'primary',
              action: 'yes',
            },
            {
              text: values[1],
              styleType: 'link',
              action: 'cancel',
            },
          ]);
        });
        break;
    }

    return emitter;
  }

  #getCustomButtons(
    buttonConfig: SkyConfirmButtonConfig[]
  ): SkyConfirmButton[] {
    const buttons: SkyConfirmButton[] = [];

    buttonConfig.forEach((config: SkyConfirmButtonConfig) => {
      buttons.push({
        text: config.text,
        action: config.action,
        styleType: config.styleType || 'default',
        autofocus: config.autofocus || false,
      } as SkyConfirmButton);
    });

    return buttons;
  }
}
