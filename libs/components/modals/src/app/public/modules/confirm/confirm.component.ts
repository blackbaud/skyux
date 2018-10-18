import {
  Component,
  OnInit,
  Optional
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  Observable
} from 'rxjs/Observable';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import 'rxjs/add/observable/zip';

import { SkyModalInstance } from '../modal';

import {
  SkyConfirmCloseEventArgs,
  SkyConfirmType,
  SkyConfirmButton,
  SkyConfirmButtonConfig
} from './types';

import {
  SkyConfirmModalContext
} from './confirm-modal-context';

@Component({
  selector: 'sky-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class SkyConfirmComponent implements OnInit {
  public buttons: SkyConfirmButton[];
  public message: string;
  public body: string;

  constructor(
    private config: SkyConfirmModalContext,
    private modal: SkyModalInstance,
    @Optional() private resourcesService: SkyLibResourcesService
  ) { }

  public ngOnInit() {
    if (this.config.type === SkyConfirmType.Custom && this.config.buttons.length > 0) {
      this.buttons = this.getCustomButtons(this.config.buttons);
    } else {
      this.getPresetButtons().subscribe((buttons: SkyConfirmButton[]) => {
        this.buttons = buttons;
      });
    }

    this.message = this.config.message;
    this.body = this.config.body;
  }

  public close(button: SkyConfirmButton) {
    const result: SkyConfirmCloseEventArgs = {
      action: button.action
    };

    this.modal.close(result);
  }

  private getPresetButtons(): Observable<SkyConfirmButton[]> {
    const emitter = new BehaviorSubject<SkyConfirmButton[]>([]);

    switch (this.config.type) {
      default:
      case SkyConfirmType.OK:
        this.resourcesService.getString('skyux_confirm_dialog_default_ok_text')
          .subscribe((value: string) => {
            emitter.next([
              {
                text: value,
                autofocus: true,
                styleType: 'primary',
                action: 'ok'
              }
            ]);
          });
        break;

      case SkyConfirmType.YesNoCancel:
        Observable.zip(
          this.resourcesService.getString('skyux_confirm_dialog_default_yes_text'),
          this.resourcesService.getString('skyux_confirm_dialog_default_no_text'),
          this.resourcesService.getString('skyux_confirm_dialog_default_cancel_text')
        ).subscribe((values: any) => {
          emitter.next([
            {
              text: values[0],
              autofocus: true,
              styleType: 'primary',
              action: 'yes'
            },
            {
              text: values[1],
              styleType: 'default',
              action: 'no'
            },
            {
              text: values[2],
              styleType: 'link',
              action: 'cancel'
            }
          ]);
        });
        break;

      case SkyConfirmType.YesCancel:
        Observable.zip(
          this.resourcesService.getString('skyux_confirm_dialog_default_yes_text'),
          this.resourcesService.getString('skyux_confirm_dialog_default_cancel_text')
        ).subscribe((values: any) => {
          emitter.next([
            {
              text: values[0],
              autofocus: true,
              styleType: 'primary',
              action: 'yes'
            },
            {
              text: values[1],
              styleType: 'link',
              action: 'cancel'
            }
          ]);
        });
        break;
    }

    return emitter;
  }

  private getCustomButtons(buttonConfig: SkyConfirmButtonConfig[]): SkyConfirmButton[] {
    const buttons: SkyConfirmButton[] = [];

    buttonConfig.forEach((config: SkyConfirmButtonConfig) => {
      buttons.push({
        text: config.text,
        action: config.action,
        styleType: config.styleType || 'default',
        autofocus: config.autofocus || false
      } as SkyConfirmButton);
    });

    return buttons;
  }
}
